"""Download PMD Collab portraits for all species in the game."""

import os
import urllib.request
import sys

BASE_URL = "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "resources", "portraits")

# species name (lowercase) -> Pokédex number (zero-padded)
SPECIES = {
    "bulbasaur": "0001",
    "ivysaur": "0002",
    "venusaur": "0003",
    "charmander": "0004",
    "charmeleon": "0005",
    "charizard": "0006",
    "squirtle": "0007",
    "wartortle": "0008",
    "blastoise": "0009",
    "pichu": "0172",
    "pikachu": "0025",
    "raichu": "0026",
    "jigglypuff": "0039",
    "wigglytuff": "0040",
    "psyduck": "0054",
    "golduck": "0055",
    "slowpoke": "0079",
    "slowbro": "0080",
    "gastly": "0092",
    "haunter": "0093",
    "gengar": "0094",
    "eevee": "0133",
    "vaporeon": "0134",
    "jolteon": "0135",
    "flareon": "0136",
}

EMOTIONS = [
    "Normal", "Happy", "Pain", "Angry", "Worried", "Sad",
    "Crying", "Shouting", "Teary-Eyed", "Determined", "Joyous",
    "Inspired", "Surprised", "Dizzy", "Sigh", "Stunned",
]


def download():
    total = 0
    skipped = 0
    failed = 0

    for name, dex in sorted(SPECIES.items()):
        species_dir = os.path.join(OUT_DIR, name)
        os.makedirs(species_dir, exist_ok=True)

        for emotion in EMOTIONS:
            dest = os.path.join(species_dir, f"{emotion}.png")
            if os.path.exists(dest):
                skipped += 1
                continue

            url = f"{BASE_URL}/{dex}/{emotion}.png"
            try:
                urllib.request.urlretrieve(url, dest)
                total += 1
                sys.stdout.write(".")
                sys.stdout.flush()
            except urllib.error.HTTPError as e:
                if e.code == 404:
                    failed += 1
                    sys.stdout.write("x")
                    sys.stdout.flush()
                else:
                    raise

    print()
    print(f"Downloaded: {total}, Skipped (exists): {skipped}, Missing (404): {failed}")


if __name__ == "__main__":
    download()
