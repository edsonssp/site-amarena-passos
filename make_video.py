#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
make_video.py - Construtor Automatizado de Vídeos para Totens e Redes Sociais
Lê sequências de imagens e áudios da pasta 'midias' e gera vídeos MP4 em alta qualidade.
Suporta barra de rodapé da marca, títulos promocionais, ajuste de resolução e áudio sincronizado.
"""

import os
import sys
import json
import re
import argparse
import subprocess
import shutil
from pathlib import Path

# Configurar stdout/stderr para UTF-8 no Windows
try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

# Extensões suportadas
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".jfif", ".bmp"}
AUDIO_EXTENSIONS = {".mp3", ".wav", ".aac", ".m4a", ".ogg", ".flac"}

DIRETORIO_SCRIPT = Path(__file__).parent.resolve()
FONTE_PADRAO = DIRETORIO_SCRIPT / "arialbd.ttf"

def natural_sort_key(s):
    """Ordenação natural para arquivos (ex: 1.jpg, 2.jpg, 10.jpg em ordem correta)."""
    return [int(text) if text.isdigit() else text.lower() for text in re.split(r'(\d+)', str(s))]

def encontrar_ffmpeg():
    """Localiza o binário do ffmpeg no sistema."""
    ffmpeg_bin = shutil.which("ffmpeg")
    if ffmpeg_bin:
        return ffmpeg_bin
    
    possiveis_locais = [
        Path(os.environ.get("LOCALAPPDATA", "")) / "Microsoft" / "WinGet" / "Packages",
        Path("C:/Program Files/ffmpeg/bin/ffmpeg.exe"),
        Path("C:/ffmpeg/bin/ffmpeg.exe"),
    ]
    for local in possiveis_locais:
        if local.exists():
            for f in local.rglob("ffmpeg.exe"):
                return str(f)
    return "ffmpeg"

def parse_args():
    parser = argparse.ArgumentParser(description="Gera vídeo MP4 a partir de imagens e áudio.")
    
    # Suporte a JSON inline como primeiro argumento
    parser.add_argument("json_params", nargs="?", default=None, help="Parâmetros em JSON inline")
    
    parser.add_argument("--duracao_por_imagem", "-d", type=float, default=3.5,
                        help="Duração em segundos que cada imagem aparece (padrão: 3.5s)")
    parser.add_argument("--nome_audio", "-a", type=str, default=None,
                        help="Nome do arquivo de áudio (ex: musica.mp3). Opcional.")
    parser.add_argument("--pasta_midias", "-p", type=str, default="midias",
                        help="Pasta contendo as imagens e áudios (padrão: midias)")
    parser.add_argument("--saida", "-s", type=str, default=None,
                        help="Nome do arquivo MP4 gerado (padrão: midias/video_gerado.mp4)")
    parser.add_argument("--resolucao", "-r", type=str, default="1080x1920",
                        help="Resolução de saída LxA (padrão: 1080x1920 para totem vertical)")
    parser.add_argument("--fps", type=int, default=30,
                        help="Taxa de quadros por segundo (padrão: 30)")
    parser.add_argument("--rodape", type=str, default="@amarenasorvetes  •  Passos - MG",
                        help="Texto para a barra inferior da marca (padrão: '@amarenasorvetes  •  Passos - MG')")
    parser.add_argument("--sem_rodape", action="store_true",
                        help="Desativa a barra inferior de marca")
    parser.add_argument("--topo", type=str, default=None,
                        help="Texto ou título promocional para o topo (ex: 'DELÍCIAS DE VERÃO')")
    parser.add_argument("--sem_audio", action="store_true",
                        help="Gera vídeo mudo em loop especial para vitrines/totens sem som")
    
    args = parser.parse_args()

    # Se um JSON foi passado como primeiro parâmetro, extrai os campos dele
    if args.json_params:
        try:
            data = json.loads(args.json_params)
            if "duracao_por_imagem" in data:
                args.duracao_por_imagem = float(data["duracao_por_imagem"])
            if "nome_audio" in data:
                args.nome_audio = data["nome_audio"]
            if "pasta_midias" in data:
                args.pasta_midias = data["pasta_midias"]
            if "saida" in data:
                args.saida = data["saida"]
            if "resolucao" in data:
                args.resolucao = data["resolucao"]
            if "rodape" in data:
                args.rodape = data["rodape"]
            if "sem_rodape" in data:
                args.sem_rodape = bool(data["sem_rodape"])
            if "topo" in data:
                args.topo = data["topo"]
            if "sem_audio" in data:
                args.sem_audio = bool(data["sem_audio"])
        except json.JSONDecodeError:
            pass

    return args

def gerar_video(duracao_por_imagem=3.5, nome_audio=None, pasta_midias="midias", saida=None,
                resolucao="1080x1920", fps=30, rodape="@amarenasorvetes  •  Passos - MG",
                sem_rodape=False, topo=None, sem_audio=False):
    pasta = Path(pasta_midias).resolve()
    pasta.mkdir(parents=True, exist_ok=True)

    if saida:
        arquivo_saida = Path(saida).resolve()
    else:
        arquivo_saida = pasta / "video_gerado.mp4"

    # Encontrar todas as imagens
    imagens = [f for f in pasta.iterdir() if f.is_file() and f.suffix.lower() in IMAGE_EXTENSIONS]
    imagens.sort(key=lambda x: natural_sort_key(x.name))

    if not imagens:
        msg_erro = f"Nenhuma imagem encontrada na pasta: {pasta}"
        print(f"❌ {msg_erro}")
        print(f"👉 Adicione imagens (.jpg, .jpeg, .png, .webp, .jfif) em '{pasta.name}' e tente novamente.")
        print(json.dumps({"error": msg_erro}))
        return False

    duracao_total = len(imagens) * duracao_por_imagem

    print("=" * 65)
    print("🎬 VIDEO BUILDER - PRODUÇÃO AUTOMATIZADA")
    print("=" * 65)
    print(f"📁 Pasta de mídias: {pasta}")
    print(f"🖼️  Total de imagens: {len(imagens)}")
    print(f"⏱️  Duração por imagem: {duracao_por_imagem:.1f}s | Total: {duracao_total:.1f}s")
    print(f"📐 Resolução: {resolucao} @ {fps} FPS")
    if not sem_rodape and rodape:
        print(f"🏷️  Barra inferior: {rodape}")
    if topo:
        print(f"📢 Título superior: {topo}")

    # Localizar o áudio
    caminho_audio = None
    if not sem_audio:
        if nome_audio:
            teste_midias = pasta / nome_audio
            teste_direto = Path(nome_audio)
            if teste_midias.exists():
                caminho_audio = teste_midias.resolve()
            elif teste_direto.exists():
                caminho_audio = teste_direto.resolve()
            else:
                print(f"⚠️  Áudio '{nome_audio}' não encontrado. Vídeo gerado sem som.")
        else:
            audios_pasta = [f for f in pasta.iterdir() if f.is_file() and f.suffix.lower() in AUDIO_EXTENSIONS]
            if len(audios_pasta) == 1:
                caminho_audio = audios_pasta[0].resolve()
                print(f"🎵 Trilha sonora automática: {caminho_audio.name}")

    # Parse da resolução
    largura, altura = 1080, 1920
    if "x" in resolucao.lower():
        try:
            parts = resolucao.lower().split("x")
            largura, altura = int(parts[0]), int(parts[1])
        except ValueError:
            largura, altura = 1080, 1920

    # Garante dimensões pares para o codec H.264
    largura = largura if largura % 2 == 0 else largura + 1
    altura = altura if altura % 2 == 0 else altura + 1

    # Cria arquivo temporário de lista para o demuxer do ffmpeg
    lista_concat = pasta / "_concat_temp.txt"
    with open(lista_concat, "w", encoding="utf-8") as f:
        for img in imagens:
            caminho_str = str(img.resolve()).replace("\\", "/")
            f.write(f"file '{caminho_str}'\n")
            f.write(f"duration {duracao_por_imagem}\n")
        # Repete a última imagem para fechar a duração correta no demuxer
        ultimo_caminho = str(imagens[-1].resolve()).replace("\\", "/")
        f.write(f"file '{ultimo_caminho}'\n")

    # Fonte temporária local para evitar problemas de escape de dois pontos no Windows
    fonte_local = pasta / "_fonte_temp.ttf"
    if FONTE_PADRAO.exists():
        shutil.copy(FONTE_PADRAO, fonte_local)
    elif Path("C:/Windows/Fonts/arialbd.ttf").exists():
        shutil.copy("C:/Windows/Fonts/arialbd.ttf", fonte_local)

    fonte_nome = fonte_local.name if fonte_local.exists() else "arialbd.ttf"

    # Construção dos filtros de vídeo
    filtros = [
        f"scale={largura}:{altura}:force_original_aspect_ratio=decrease",
        f"pad={largura}:{altura}:(ow-iw)/2:(oh-ih)/2:black"
    ]

    # Opção 3: Barra inferior com identidade da marca
    if not sem_rodape and rodape:
        altura_barra = int(altura * 0.075)  # ~144px em 1920
        pos_y_barra = f"ih-{altura_barra}"
        pos_y_linha = f"ih-{altura_barra + 4}"
        pos_y_texto = f"h-{int(altura_barra * 0.62)}"
        tamanho_fonte = int(altura * 0.021)  # ~40px em 1920
        
        # Linha de destaque dourada Amarena
        filtros.append(f"drawbox=y={pos_y_linha}:color=0xffd700@0.9:width=iw:height=4:t=fill")
        # Tarja bordô oficial Amarena
        filtros.append(f"drawbox=y={pos_y_barra}:color=0x8b0000@0.88:width=iw:height={altura_barra}:t=fill")
        # Texto da barra
        rodape_safe = rodape.replace("'", "").replace(":", "-")
        filtros.append(f"drawtext=fontfile='{fonte_nome}':text='{rodape_safe}':fontsize={tamanho_fonte}:fontcolor=white:x=(w-text_w)/2:y={pos_y_texto}")

    # Barra superior promocional (opcional)
    if topo:
        altura_topo = int(altura * 0.065)  # ~125px em 1920
        tamanho_fonte_topo = int(altura * 0.022)
        filtros.append(f"drawbox=y=0:color=0x8b0000@0.88:width=iw:height={altura_topo}:t=fill")
        filtros.append(f"drawbox=y={altura_topo}:color=0xffd700@0.9:width=iw:height=4:t=fill")
        topo_safe = topo.replace("'", "").replace(":", "-")
        filtros.append(f"drawtext=fontfile='{fonte_nome}':text='{topo_safe}':fontsize={tamanho_fonte_topo}:fontcolor=0xffe600:x=(w-text_w)/2:y={int(altura_topo*0.3)}")

    filtros.append("format=yuv420p")
    vf_filtro = ",".join(filtros)

    ffmpeg_bin = encontrar_ffmpeg()

    cmd = [
        ffmpeg_bin, "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", str(lista_concat)
    ]

    if caminho_audio and not sem_audio:
        fade_out_start = max(0.0, duracao_total - 1.0)
        cmd.extend([
            "-i", str(caminho_audio),
            "-filter_complex",
            f"[0:v]{vf_filtro}[v];"
            f"[1:a]afade=t=in:ss=0:d=0.5,afade=t=out:st={fade_out_start:.2f}:d=1.0[a]",
            "-map", "[v]",
            "-map", "[a]",
            "-t", f"{duracao_total:.2f}"
        ])
    else:
        cmd.extend([
            "-vf", vf_filtro,
            "-t", f"{duracao_total:.2f}"
        ])

    cmd.extend([
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "20",
        "-r", str(fps),
        "-pix_fmt", "yuv420p",
        "-shortest",
        str(arquivo_saida)
    ])

    print("🚀 Renderizando com FFmpeg...")
    try:
        resultado = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding="utf-8", errors="replace", cwd=str(pasta))
        if resultado.returncode != 0:
            print(f"❌ Erro no FFmpeg:\n{resultado.stderr}")
            print(json.dumps({"error": resultado.stderr}))
            return False
        
        tamanho_mb = arquivo_saida.stat().st_size / (1024 * 1024)
        print("=" * 65)
        print("✅ VÍDEO CONCLUÍDO COM SUCESSO!")
        print(f"📁 Localização: {arquivo_saida}")
        print(f"📦 Tamanho: {tamanho_mb:.2f} MB")
        print(f"⏱️  Duração: {duracao_total:.1f} segundos")
        print("=" * 65)
        print(json.dumps({
            "success": True,
            "arquivo": str(arquivo_saida),
            "duracao_segundos": duracao_total,
            "tamanho_mb": round(tamanho_mb, 2)
        }))
        return True

    finally:
        if lista_concat.exists():
            try:
                lista_concat.unlink()
            except Exception:
                pass
        if fonte_local.exists():
            try:
                fonte_local.unlink()
            except Exception:
                pass

def main():
    args = parse_args()
    sucesso = gerar_video(
        duracao_por_imagem=args.duracao_por_imagem,
        nome_audio=args.nome_audio,
        pasta_midias=args.pasta_midias,
        saida=args.saida,
        resolucao=args.resolucao,
        fps=args.fps,
        rodape=args.rodape,
        sem_rodape=args.sem_rodape,
        topo=args.topo,
        sem_audio=args.sem_audio
    )
    sys.exit(0 if sucesso else 1)

if __name__ == "__main__":
    main()
