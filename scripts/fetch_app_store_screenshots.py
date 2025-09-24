import os
import re
import sys
import requests
from bs4 import BeautifulSoup


def get_highest_quality_url(url: str) -> str:
    """Replace dimensions in the App Store image URL to request the largest asset."""
    return re.sub(r"/\d+x\d+", "/9999x0", url)


def fetch_app_screenshots(app_store_url: str, output_root: str = ".") -> str:
    print(f"Fetching URL: {app_store_url}")
    response = requests.get(app_store_url)
    response.raise_for_status()

    soup = BeautifulSoup(response.content, "html.parser")

    screenshot_tags = soup.find_all("picture", class_=re.compile("we-artwork--screenshot"))
    print(f"Found {len(screenshot_tags)} screenshot tags")

    screenshot_urls = []
    for tag in screenshot_tags:
        for img_type in ["image/png", "image/jpeg", "image/webp"]:
            source_tag = tag.find("source", type=img_type)
            if source_tag and "srcset" in source_tag.attrs:
                url = source_tag["srcset"].split(",")[0].strip().split()[0]
                screenshot_urls.append(get_highest_quality_url(url))
                break

    print(f"Extracted {len(screenshot_urls)} screenshot URLs")
    for url in screenshot_urls[:3]:
        print(f"Sample URL: {url}")

    app_name_tag = soup.find("h1", class_="product-header__title")
    if app_name_tag:
        app_name = " ".join(app_name_tag.text.split())
    else:
        print("Couldn't find app name, using 'Unknown App'")
        app_name = "Unknown App"

    dir_name = app_name.replace(" ", "_")
    output_dir = os.path.join(output_root, dir_name)
    os.makedirs(output_dir, exist_ok=True)
    print(f"Created directory: {output_dir}")

    for idx, url in enumerate(screenshot_urls, start=1):
        print(f"Downloading image {idx} from {url}")
        img_response = requests.get(url)
        if img_response.status_code != 200:
            print(f"Failed to download image {idx}. Status code: {img_response.status_code}")
            continue

        content_type = img_response.headers.get("Content-Type", "")
        if "png" in content_type:
            ext = "png"
        elif "jpeg" in content_type:
            ext = "jpg"
        elif "webp" in content_type:
            ext = "webp"
        else:
            ext = "jpg"

        file_path = os.path.join(output_dir, f"screenshot_{idx}.{ext}")
        with open(file_path, "wb") as file:
            file.write(img_response.content)
        print(f"Downloaded: {file_path}")

    print(f"All screenshots downloaded for {app_name}")
    return output_dir


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fetch_app_store_screenshots.py <app_store_url> [output_dir]")
        sys.exit(1)

    url = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else "."
    fetch_app_screenshots(url, output_dir)
