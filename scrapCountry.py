import requests
from bs4 import BeautifulSoup
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

# Liste des pays à scraper
countryList = ["Autriche"]

# URL de base
BASE_URL = "https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/conseils-par-pays-destination/"
SECTIONS = ["derniere", "securite", "entree", "sante", "complements"]

# Fonction pour récupérer les informations

def scrape_country_info(country):
    country_info = {}
    
    for section in SECTIONS:
        url = f"{BASE_URL}{country}/#{section}"
        headers = {"User-Agent": "Mozilla/5.0"}
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "html.parser")
            
            # Récupérer les informations dans <div class="js-tabs"> et <div class="representation_infos">
            tabs_content = soup.find("div", class_="js-tabs")
            representation_info = soup.find("div", class_="representation_infos")
            
            text_content = ""
            if tabs_content:
                text_content += tabs_content.get_text(separator="\n", strip=True) + "\n"
            if representation_info:
                text_content += representation_info.get_text(separator="\n", strip=True)
            
            country_info[section] = text_content if text_content else "Informations non disponibles"
            
        except requests.RequestException as e:
            country_info[section] = f"Erreur lors du scraping : {e}"
    
    return country, country_info

# Scraper les pays en parallèle
def scrape_all_countries():
    results = {}
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(scrape_country_info, country): country for country in countryList}
        for future in as_completed(futures):
            country, info = future.result()
            results[country] = info
            print(f"✅ {country} terminé.")
    return results

# Sauvegarde dans un fichier JSON
def save_results(results, country_list):
    filename = "-".join(country_list) + ".json"  # Concatène les pays avec "-"
    filename = filename.replace(" ", "_")  # Remplace les espaces par des underscores si nécessaire

    with open(filename, "w", encoding="utf-8") as json_file:
        json.dump(results, json_file, ensure_ascii=False, indent=4)

# Exécution du script
if __name__ == "__main__":
    print("Début du scraping...")
    results = scrape_all_countries()
    save_results(results, countryList)  # Ajout de countryList en argument
    print(f"\n✅ Données sauvegardées dans : {'-'.join(countryList)}.json")  # Correction du print

