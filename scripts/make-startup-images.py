#!/usr/bin/env python3
import os
import struct
import zlib

RGB = (15, 23, 42)  # #0F172A
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "splash")

SIZES = [
    (1320, 2868),
    (1290, 2796),
    (1284, 2778),
    (1242, 2688),
    (1206, 2622),
    (1179, 2556),
    (1170, 2532),
    (1125, 2436),
    (1242, 2208),
    (828, 1792),
    (750, 1334),
]


def chunk(tag: bytes, data: bytes) -> bytes:
    return (
        struct.pack(">I", len(data))
        + tag
        + data
        + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    )


def write_png(path: str, width: int, height: int) -> None:
    raw = b"".join(b"\x00" + bytes(RGB) * width for _ in range(height))
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )
    with open(path, "wb") as handle:
        handle.write(png)


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    for width, height in SIZES:
        path = os.path.join(OUT, f"apple-splash-{width}-{height}.png")
        write_png(path, width, height)
        print(path, os.path.getsize(path))


if __name__ == "__main__":
    main()
