from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path


RUNTIME_DIR = Path("/Users/baihe/Documents/bohack/tts-lab/voxcpm2-runtime")
if str(RUNTIME_DIR) not in sys.path:
    sys.path.insert(0, str(RUNTIME_DIR))

from generate_game_voices import (  # noqa: E402
    TMP_ROOT,
    VOICE_LINES,
    generate_wav,
    load_model,
    write_mp3,
)


def find_node(city: str, node_id: str) -> dict:
    for node in VOICE_LINES.get(city, []):
        if node["id"] == node_id:
            return node
    raise ValueError(f"Unknown voice node: {city}/{node_id}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", required=True)
    parser.add_argument("--city", required=True)
    parser.add_argument("--node", required=True)
    parser.add_argument("--text", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--line-id", required=True)
    parser.add_argument("--cfg-scale", type=float, default=2.7)
    parser.add_argument("--ddpm-steps", type=int, default=30)
    parser.add_argument("--target-lufs", type=float, default=-16.0)
    parser.add_argument("--true-peak", type=float, default=-1.5)
    parser.add_argument("--lra", type=float, default=7.0)
    args = parser.parse_args()

    node = find_node(args.city, args.node)
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    stage_wav = TMP_ROOT / args.city / args.node / "stage.wav"
    prompt_audio = stage_wav if stage_wav.exists() else None
    prompt_text = node.get("stage") if prompt_audio else None

    model = load_model(Path(args.model))
    wav_dir = TMP_ROOT / "dynamic" / args.city / args.node
    wav_path = generate_wav(
        model,
        args.text,
        wav_dir,
        args.line_id,
        None if prompt_audio else node.get("voice"),
        args.cfg_scale,
        args.ddpm_steps,
        ref_audio=prompt_audio,
        ref_text=prompt_text,
        prompt_audio=prompt_audio,
        prompt_text=prompt_text,
    )
    tmp_mp3 = wav_dir / f"{args.line_id}.mp3"
    write_mp3(wav_path, tmp_mp3, args.target_lufs, args.true_peak, args.lra)
    shutil.copyfile(tmp_mp3, out_path)
    print(out_path)


if __name__ == "__main__":
    main()
