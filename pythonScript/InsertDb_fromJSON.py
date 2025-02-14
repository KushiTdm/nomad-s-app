import json
from supabase import create_client, Client

# Configuration Supabase
SUPABASE_URL = ""  # URL Supabase
SUPABASE_KEY = ""  # Clé API

# Connexion à Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Données à insérer (exemple pour les États-Unis)
data = {
    "country": {
        "id": "US",
        "name": "États-Unis",
        "passport_validity": "6 mois après la date de retour prévue",
        "time_zone": "UTC-5 à UTC-10 (selon l'État)",
        "climate": "Varié (continental, subtropical, aride, etc.)",
        "image": "https://example.com/image-usa.jpg"
    },
    "entry_requirements": {
        "visa_required": True,
        "visa_duration": "90 jours (pour l'ESTA)",
        "visa_cost": "21 USD (pour l'ESTA)",
        "e_visa_available": True,
        "exemptions": "Aucune exemption pour les ressortissants français sans ESTA ou visa"
    },
    "vaccines": [
        {
            "type": "recommended",
            "vaccine_name": "Vaccins de routine (diphtérie, tétanos, poliomyélite, etc.)"
        }
    ],
    "customs_restrictions": {
        "prohibited_items": ["drogues", "armes", "produits contrefaits"],
        "specific_rules": "Les produits alimentaires et végétaux sont soumis à des restrictions strictes"
    },
    "estimated_budget": {
        "accommodation": "100-300 USD par nuit (selon la ville)",
        "transport": "2-5 USD par trajet en transport public (selon la ville)",
        "meals": "15-50 USD par repas (selon le type de restaurant)"
    },
    "real_time_alerts": {
        "political_risks": "Risques modérés liés aux tensions sociales ou politiques",
        "health_risks": "Risques faibles, mais vigilance face aux maladies saisonnières (grippe, COVID-19)",
        "climate_risks": "Ouraganes (sud-est), tornades (Midwest), incendies de forêt (ouest)"
    },
    "emergency_contacts": {
        "police": "911",
        "ambulance": "911",
        "french_embassy_email": "info@ambafrance-us.org"
    },
    "currency": {
        "local_currency": "Dollar américain (USD)",
        "exchange_rate": "1 EUR = 1.07 USD (taux variable)"
    },
    "payment_methods": {
        "credit_card": True,
        "cash": True,
        "crypto": False,
        "apple_pay": True
    },
    "languages_spoken": ["Anglais", "Espagnol (dans certaines régions)"],
    "dominant_religions": ["Christianisme"],
    "local_laws_customs": {
        "main_rules": [
            "Pourboire obligatoire dans les restaurants (15-20%)",
            "Respect des lois locales (chaque État a ses propres règles)"
        ]
    },
    "survival_phrasebook": [
        {
            "english": "Hello",
            "translation": "Hello"
        },
        {
            "english": "Thank you",
            "translation": "Thank you"
        }
    ],
    "sim_esim": {
        "providers": ["AT&T", "Verizon", "T-Mobile"],
        "budget": "Environ 30-50 USD pour une carte SIM prépayée"
    }
}

# Fonction pour insérer des données dans une table
def insert_into_table(table_name, data, country_id=None):
    # Si les données sont une liste, insérer chaque élément individuellement
    if isinstance(data, list):
        for item in data:
            if country_id:
                item["country_id"] = country_id  # Ajouter la clé étrangère country_id
            response = supabase.table(table_name).insert([item]).execute()
            if response.data:
                print(f"Données insérées avec succès dans la table {table_name} !")
            else:
                print(f"Erreur lors de l'insertion dans la table {table_name}.")
                print(response.error)
    else:
        # Si les données ne sont pas une liste, insérer directement
        if country_id:
            data["country_id"] = country_id  # Ajouter la clé étrangère country_id
        response = supabase.table(table_name).insert([data]).execute()
        if response.data:
            print(f"Données insérées avec succès dans la table {table_name} !")
        else:
            print(f"Erreur lors de l'insertion dans la table {table_name}.")
            print(response.error)

# Insérer les données dans la table countries
country_data = data["country"]
insert_into_table("countries", country_data)

# Récupérer l'ID du pays inséré
country_id = country_data["id"]

# Insérer les données dans les autres tables
insert_into_table("entry_requirements", data["entry_requirements"], country_id)
insert_into_table("vaccines", data["vaccines"], country_id)
insert_into_table("customs_restrictions", data["customs_restrictions"], country_id)
insert_into_table("estimated_budget", data["estimated_budget"], country_id)
insert_into_table("real_time_alerts", data["real_time_alerts"], country_id)
insert_into_table("emergency_contacts", data["emergency_contacts"], country_id)
insert_into_table("currency", data["currency"], country_id)
insert_into_table("payment_methods", data["payment_methods"], country_id)

# Pour les tables avec des listes de valeurs (languages_spoken, dominant_religions, etc.)
for language in data["languages_spoken"]:
    insert_into_table("languages_spoken", {"language": language}, country_id)

for religion in data["dominant_religions"]:
    insert_into_table("dominant_religions", {"religion": religion}, country_id)

insert_into_table("local_laws_customs", data["local_laws_customs"], country_id)

for phrase in data["survival_phrasebook"]:
    insert_into_table("survival_phrasebook", phrase, country_id)

insert_into_table("sim_esim", data["sim_esim"], country_id)