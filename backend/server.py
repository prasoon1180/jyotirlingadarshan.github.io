from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
import razorpay
import hmac
import hashlib

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Razorpay client
razorpay_key_id = os.environ.get('RAZORPAY_KEY_ID')
razorpay_key_secret = os.environ.get('RAZORPAY_KEY_SECRET')
razorpay_client = razorpay.Client(auth=(razorpay_key_id, razorpay_key_secret)) if razorpay_key_id and razorpay_key_secret else None

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class LocationData(BaseModel):
    lat: float
    lng: float
    state: str
    region: str

class TravelInfo(BaseModel):
    nearest_airport: str
    nearest_railway: str
    road_connectivity: str

class Timings(BaseModel):
    morning: str
    evening: str
    aarti_time: str
    closed_on: Optional[str] = None

class Jyotirlinga(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    name: str
    location: LocationData
    description: str
    mythology: str
    history: str
    rituals: List[str]
    timings: Timings
    stay_options: List[str]
    food_options: List[str]
    nearby_attractions: List[str]
    travel_info: TravelInfo
    image_url: str
    best_time_to_visit: str

class JyotirlingaCreate(BaseModel):
    name: str
    location: LocationData
    description: str
    mythology: str
    history: str
    rituals: List[str]
    timings: Timings
    stay_options: List[str]
    food_options: List[str]
    nearby_attractions: List[str]
    travel_info: TravelInfo
    image_url: str
    best_time_to_visit: str

# Routes
@api_router.get("/")
async def root():
    return {"message": "Welcome to Jyotirlingas API"}

@api_router.get("/jyotirlingas", response_model=List[Jyotirlinga])
async def get_all_jyotirlingas():
    temples = await db.jyotirlingas.find({}, {"_id": 0}).to_list(100)
    return temples

@api_router.get("/jyotirlingas/{temple_id}", response_model=Jyotirlinga)
async def get_jyotirlinga(temple_id: str):
    temple = await db.jyotirlingas.find_one({"id": temple_id}, {"_id": 0})
    if not temple:
        raise HTTPException(status_code=404, detail="Temple not found")
    return temple

@api_router.get("/jyotirlingas/search/{query}")
async def search_jyotirlingas(query: str):
    temples = await db.jyotirlingas.find(
        {
            "$or": [
                {"name": {"$regex": query, "$options": "i"}},
                {"location.state": {"$regex": query, "$options": "i"}},
                {"location.region": {"$regex": query, "$options": "i"}}
            ]
        },
        {"_id": 0}
    ).to_list(100)
    return temples

@api_router.post("/jyotirlingas", response_model=Jyotirlinga)
async def create_jyotirlinga(temple: JyotirlingaCreate):
    temple_dict = temple.model_dump()
    temple_dict['id'] = temple.name.lower().replace(' ', '-')
    await db.jyotirlingas.insert_one(temple_dict)
    return Jyotirlinga(**temple_dict)

# Seed data endpoint
@api_router.post("/seed")
async def seed_data():
    existing = await db.jyotirlingas.count_documents({})
    if existing > 0:
        return {"message": "Database already seeded", "count": existing}
    
    jyotirlingas_data = [
        {
            "id": "somnath",
            "name": "Somnath",
            "location": {"lat": 20.888, "lng": 70.4012, "state": "Gujarat", "region": "Prabhas Patan, Veraval"},
            "description": "The first among the twelve Jyotirlinga shrines of Shiva, located in Prabhas Patan near Veraval in Saurashtra. The temple has been destroyed and rebuilt several times throughout history.",
            "mythology": "Legend says that the Moon God (Chandra) was cursed by his father-in-law Daksha that he would wane. The Moon prayed to Lord Shiva, who appeared in the form of a Jyotirlinga and blessed him that he would wax and wane periodically.",
            "history": "The temple has a legendary history dating back to ancient times. It was destroyed by Mahmud of Ghazni in 1026 and rebuilt multiple times. The current structure was reconstructed in Chaulukya style of Hindu temple architecture.",
            "rituals": ["Morning Aarti at 7:00 AM", "Rudrabhishek every Monday", "Evening Aarti at 7:00 PM", "Maha Shivaratri special puja"],
            "timings": {"morning": "6:00 AM - 9:30 PM", "evening": "5:00 PM - 9:30 PM", "aarti_time": "7:00 AM & 7:00 PM", "closed_on": None},
            "stay_options": ["Somnath Trust Guest House", "Hotel Somnath Sagar", "Shree Somnath Lodge", "Various dharamshalas near the temple", "Hotels in Veraval (6 km away)"],
            "food_options": ["Prasad from temple kitchen", "Gujarati thali restaurants nearby", "Vegetarian restaurants in Veraval", "Street food at Triveni Ghat"],
            "nearby_attractions": ["Triveni Sangam - confluence of three rivers", "Bhalka Tirtha - where Lord Krishna was struck by an arrow", "Prabhas Patan Museum", "Junagadh (85 km)", "Gir National Park (45 km)"],
            "travel_info": {"nearest_airport": "Diu Airport (63 km)", "nearest_railway": "Veraval Railway Station (5 km)", "road_connectivity": "Well connected by road to Ahmedabad (400 km), Rajkot (200 km), and other Gujarat cities"},
            "image_url": "https://customer-assets.emergentagent.com/job_sacred-lingas/artifacts/e6hll99n_Somnath.jpg",
            "best_time_to_visit": "October to March"
        },
        {
            "id": "mallikarjuna",
            "name": "Mallikarjuna",
            "location": {"lat": 16.0726, "lng": 78.8685, "state": "Andhra Pradesh", "region": "Srisailam"},
            "description": "Located on the Srisailam hill on the banks of River Krishna in Andhra Pradesh. It is one of the most ancient temples dedicated to Lord Shiva and is also one of the 18 Shakti Peethas.",
            "mythology": "According to legend, Lord Shiva and Goddess Parvati assumed the forms of Mallikarjuna and Bhramaramba to reside on the Srisailam hill after their sons Ganesha and Kartikeya competed to marry first.",
            "history": "The temple dates back to the 2nd century and has been mentioned in ancient Tamil and Sanskrit texts. It was patronized by various dynasties including the Satavahanas, Ikshvakus, and Vijayanagara kings.",
            "rituals": ["Abhishekam six times daily", "Rudrabhishek on Mondays", "Maha Shivaratri celebrations", "Special puja during Karthika month"],
            "timings": {"morning": "4:30 AM - 3:30 PM", "evening": "6:00 PM - 10:00 PM", "aarti_time": "5:00 AM & 8:00 PM", "closed_on": None},
            "stay_options": ["Srisailam Devasthanam Guest House", "Haritha Hotel (APTDC)", "Punnami Srisailam", "Private lodges near temple"],
            "food_options": ["Temple prasadam", "Anna prasadam (free meals)", "South Indian vegetarian restaurants", "Andhra thali restaurants"],
            "nearby_attractions": ["Srisailam Dam and Reservoir", "Akka Mahadevi Caves", "Sikharesvara Temple", "Mallela Theertham Waterfall", "Patala Ganga (riverside ghat)"],
            "travel_info": {"nearest_airport": "Hyderabad Airport (213 km)", "nearest_railway": "Markapur Railway Station (86 km)", "road_connectivity": "Connected by road to Hyderabad, Vijayawada, and Kurnool"},
            "image_url": "https://customer-assets.emergentagent.com/job_sacred-lingas/artifacts/2qjolndg_Mallikarjuna.jpg",
            "best_time_to_visit": "October to February"
        },
        {
            "id": "mahakaleshwar",
            "name": "Mahakaleshwar",
            "location": {"lat": 23.1828, "lng": 75.7682, "state": "Madhya Pradesh", "region": "Ujjain"},
            "description": "Located in the ancient city of Ujjain in Madhya Pradesh. The temple is one of the most revered Jyotirlingas and is known for its Bhasma Aarti performed with sacred ash at dawn.",
            "mythology": "Legend tells of a demon named Dushana who terrorized the city. Lord Shiva appeared as Mahakaleshwar and vanquished the demon, then resided there as a Jyotirlinga to protect the city.",
            "history": "The temple is mentioned in ancient texts and was renovated by the Maratha ruler Ranoji Shinde in the 18th century. The present structure showcases Maratha, Bhumija, and Chalukya architectural styles.",
            "rituals": ["Famous Bhasma Aarti at 4:00 AM (advance booking required)", "Sawari procession on Mondays", "Daily abhishekam ceremonies", "Maha Shivaratri grand celebrations"],
            "timings": {"morning": "4:00 AM - 11:00 PM", "evening": "5:00 PM - 11:00 PM", "aarti_time": "4:00 AM Bhasma Aarti, 7:00 PM Evening Aarti", "closed_on": None},
            "stay_options": ["Mahakal Temple Trust Dharamshala", "Hotel Shri Mahakaal", "Hotel Shipra Residency", "MP Tourism hotels"],
            "food_options": ["Temple prasad", "Famous Ujjain poha and jalebi", "Traditional Malwa cuisine", "Vegetarian restaurants on Mahakal Road"],
            "nearby_attractions": ["Ram Ghat on Shipra River", "Kal Bhairav Temple", "Harsiddhi Temple", "Sandipani Ashram", "Vedh Shala (ancient observatory)"],
            "travel_info": {"nearest_airport": "Devi Ahilyabai Holkar Airport, Indore (55 km)", "nearest_railway": "Ujjain Junction (2 km)", "road_connectivity": "Well connected to Indore, Bhopal, and other MP cities"},
            "image_url": "https://customer-assets.emergentagent.com/job_sacred-lingas/artifacts/s2k0tvzg_%F0%9F%93%8DMahakal%20Temple%2CUjjain.jpg",
            "best_time_to_visit": "October to March"
        },
        {
            "id": "omkareshwar",
            "name": "Omkareshwar",
            "location": {"lat": 22.2411, "lng": 76.1473, "state": "Madhya Pradesh", "region": "Khandwa"},
            "description": "Located on an island called Mandhata or Shivapuri in the Narmada River. The island is shaped like the Hindu symbol 'Om', making it a unique and sacred pilgrimage site.",
            "mythology": "The Vindhya mountain prayed to Lord Shiva to reside there. Pleased by the devotion, Shiva appeared in two forms - Omkareshwar and Amareshwar (Mamleshwar), both considered as Jyotirlingas.",
            "history": "The temple was built by the Paramara dynasty and later renovated by various rulers. The architecture shows influences of Nagara and Dravidian styles with beautiful stone carvings.",
            "rituals": ["Morning Rudrabhishek", "Narmada parikrama (circumambulation of island)", "Daily aarti ceremonies", "Special abhishekam on Mondays"],
            "timings": {"morning": "5:00 AM - 12:00 PM", "evening": "4:00 PM - 9:00 PM", "aarti_time": "6:00 AM & 7:00 PM", "closed_on": None},
            "stay_options": ["MP Tourism Narmada Resort", "Temple trust guest houses", "Hotels on Mandhata island", "Budget lodges in nearby areas"],
            "food_options": ["Temple prasad", "Vegetarian restaurants on the island", "Local Madhya Pradesh cuisine", "Street food near ghats"],
            "nearby_attractions": ["Mamleshwar Temple (second Jyotirlinga here)", "24 Avatars - group of Jain and Hindu temples", "Satmatrika Temples", "Siddhanath Temple", "Narmada River ghats"],
            "travel_info": {"nearest_airport": "Indore Airport (77 km)", "nearest_railway": "Omkareshwar Road Station (12 km)", "road_connectivity": "Connected to Indore, Ujjain, and Khandwa by road"},
            "image_url": "https://customer-assets.emergentagent.com/job_sacred-lingas/artifacts/v8l74fq8_omkareshwar.jpg",
            "best_time_to_visit": "October to March"
        },
        {
            "id": "kedarnath",
            "name": "Kedarnath",
            "location": {"lat": 30.7352, "lng": 79.0669, "state": "Uttarakhand", "region": "Rudraprayag"},
            "description": "Located in the majestic Himalayas at an altitude of 3,583 meters. It is the highest among all 12 Jyotirlingas and part of the sacred Char Dham pilgrimage.",
            "mythology": "The Pandavas sought Lord Shiva's forgiveness after the Mahabharata war. Shiva took the form of a bull, and when Bhima tried to catch him, he went underground leaving his hump on the surface, which became the Kedarnath Jyotirlinga.",
            "history": "The temple is believed to be over 1,000 years old, built by Adi Shankaracharya. The structure is made of massive stone slabs and has withstood many natural calamities including the 2013 Uttarakhand floods.",
            "rituals": ["Morning abhishekam", "Maha Aarti", "Bhairav worship (mandatory after Kedarnath darshan)", "Seasonal opening and closing ceremonies"],
            "timings": {"morning": "6:00 AM - 7:00 PM (during season)", "evening": "5:00 PM - 7:00 PM", "aarti_time": "6:30 AM & 6:30 PM", "closed_on": "Closes for winter (Nov-Apr)"},
            "stay_options": ["Government and private dharamshalas in Kedarnath", "Tent accommodation during season", "Hotels in Gaurikund (16 km trek away)", "Accommodation in Guptkashi (30 km from Gaurikund)"],
            "food_options": ["Temple prasad", "Basic vegetarian meals in dharamshalas", "Packed food recommended", "Better dining options in Gaurikund and Guptkashi"],
            "nearby_attractions": ["Bhairavnath Temple (1 km trek)", "Gandhi Sarovar Lake", "Vasuki Tal Lake (8 km trek)", "Chorabari Tal (Gandhi Sarovar)", "Triyuginarayan Temple in Triyuginarayan"],
            "travel_info": {"nearest_airport": "Jolly Grant Airport, Dehradun (239 km from Gaurikund)", "nearest_railway": "Rishikesh Railway Station (221 km from Gaurikund)", "road_connectivity": "Road till Gaurikund, then 16 km trek or helicopter service to Kedarnath"},
            "image_url": "https://customer-assets.emergentagent.com/job_sacred-lingas/artifacts/titq1jjd_kedarnath.jpg",
            "best_time_to_visit": "May to June and September to October (temple closed in winter)"
        },
        {
            "id": "bhimashankar",
            "name": "Bhimashankar",
            "location": {"lat": 19.07, "lng": 73.553, "state": "Maharashtra", "region": "Pune"},
            "description": "Located in the Sahyadri hills of Maharashtra, the temple is surrounded by dense forests and is the source of the Bhima river. The region is also a wildlife sanctuary.",
            "mythology": "A demon named Bhima tormented the people and claimed to be the son of Shiva. Lord Shiva appeared and defeated him. Upon Bhima's repentance, Shiva gave him a place in his name and established himself as Bhimashankar.",
            "history": "The temple was constructed during the 13th century under the Maratha Empire. Nana Phadnavis, an influential minister during the Peshwa period, made significant contributions to the temple's development.",
            "rituals": ["Daily abhishekam", "Maha Aarti in morning and evening", "Rudrabhishek on Mondays and Pradosh", "Shravan month special pujas"],
            "timings": {"morning": "5:00 AM - 9:30 PM", "evening": "5:00 PM - 9:30 PM", "aarti_time": "6:30 AM & 7:30 PM", "closed_on": None},
            "stay_options": ["Temple trust guest house", "Maharashtra Tourism Resort", "Private lodges near temple", "Homestays in nearby villages"],
            "food_options": ["Temple prasad", "Maharashtrian vegetarian meals", "Simple restaurants near temple", "Better options in Khandala village"],
            "nearby_attractions": ["Bhimashankar Wildlife Sanctuary", "Hanuman Lake", "Gupt Bhimashankar (old temple)", "Nagphani (Duke's Nose viewpoint, 50 km)", "Karjat and Lonavala (nearby hill stations)"],
            "travel_info": {"nearest_airport": "Pune Airport (112 km)", "nearest_railway": "Pune Railway Station (100 km)", "road_connectivity": "Connected to Pune and Mumbai by road; last stretch is ghat road"},
            "image_url": "https://customer-assets.emergentagent.com/job_sacred-lingas/artifacts/3fw4wwne_Bhimshankar.jpg",
            "best_time_to_visit": "October to February"
        },
        {
            "id": "kashi-vishwanath",
            "name": "Kashi Vishwanath",
            "location": {"lat": 25.3109, "lng": 83.0106, "state": "Uttar Pradesh", "region": "Varanasi"},
            "description": "Located in the holy city of Varanasi on the banks of River Ganga. It is one of the most sacred temples in India and the center of faith for millions of Hindus worldwide.",
            "mythology": "Varanasi is considered the city of Lord Shiva. It is believed that those who die in Varanasi attain moksha (liberation). The Jyotirlinga represents Shiva's infinite presence and cosmic energy.",
            "history": "The temple has been destroyed and rebuilt multiple times throughout history. The current structure was built by Maharani Ahilyabai Holkar in 1780. The golden spire was donated by Maharaja Ranjit Singh.",
            "rituals": ["Mangala Aarti at 3:00 AM", "Bhog Aarti at noon", "Sandhya Aarti in evening", "Shringar Aarti at night", "Shayan Aarti at closing"],
            "timings": {"morning": "2:30 AM - 11:00 PM", "evening": "5:00 PM - 11:00 PM", "aarti_time": "3:00 AM, 11:15 AM, 7:00 PM, 9:00 PM", "closed_on": None},
            "stay_options": ["Hotels near Dashashwamedh Ghat", "Guest houses in old Varanasi", "Luxury hotels on Mall Road", "Ashrams and dharamshalas"],
            "food_options": ["Temple prasad", "Famous Kashi chaat and sweets", "Banarasi paan", "Vegetarian restaurants throughout the city", "River-view cafes near ghats"],
            "nearby_attractions": ["Dashashwamedh Ghat and Ganga Aarti", "Manikarnika Ghat", "Assi Ghat", "Sarnath (Buddhist pilgrimage, 10 km)", "Ramnagar Fort", "Tulsi Manas Mandir"],
            "travel_info": {"nearest_airport": "Lal Bahadur Shastri Airport, Varanasi (25 km)", "nearest_railway": "Varanasi Junction (5 km)", "road_connectivity": "Well connected to all major cities by road and rail"},
            "image_url": "https://customer-assets.emergentagent.com/job_sacred-lingas/artifacts/i7qbj98d_Kashi%20Viswanath.jpg",
            "best_time_to_visit": "October to March"
        },
        {
            "id": "trimbakeshwar",
            "name": "Trimbakeshwar",
            "location": {"lat": 19.939, "lng": 73.529, "state": "Maharashtra", "region": "Nashik"},
            "description": "Located near Nashik at the source of the Godavari River. The temple has a unique feature where the Jyotirlinga is set in a hollow space in the floor of the sanctum.",
            "mythology": "The sage Gautama accidentally killed a cow and performed penance. Lord Shiva appeared and released the Ganga as the Godavari river. The three-faced lingam represents Brahma, Vishnu, and Shiva.",
            "history": "The temple was constructed by Peshwa Balaji Bajirao in the 18th century. The unique Indo-Aryan architecture features a black stone temple with intricate carvings and a golden crown.",
            "rituals": ["Abhishekam performed by temple priests only", "Rudrabhishek on Mondays", "Special pujas during Shravan month", "Kumbh Mela held every 12 years"],
            "timings": {"morning": "5:30 AM - 9:00 PM", "evening": "5:00 PM - 9:00 PM", "aarti_time": "6:30 AM & 7:30 PM", "closed_on": None},
            "stay_options": ["Hotels in Trimbakeshwar town", "Resorts near Nashik", "Dharamshalas near temple", "Budget lodges for pilgrims"],
            "food_options": ["Temple prasad", "Maharashtrian vegetarian restaurants", "Nashik's famous misal pav", "Local snacks and sweet shops"],
            "nearby_attractions": ["Godavari River origin (Brahmagiri Hill)", "Anjaneri Hills (birthplace of Hanuman)", "Nashik wine capital (30 km)", "Pandav Leni Caves", "Saptashrungi Devi Temple (60 km)"],
            "travel_info": {"nearest_airport": "Nashik Airport (30 km)", "nearest_railway": "Nashik Road Railway Station (28 km)", "road_connectivity": "Well connected to Mumbai (180 km) and Pune (170 km)"},
            "image_url": "https://customer-assets.emergentagent.com/job_sacred-lingas/artifacts/vg2ck3w8_Trimbhakeshwar.jpg",
            "best_time_to_visit": "October to March"
        },
        {
            "id": "vaidyanath",
            "name": "Vaidyanath",
            "location": {"lat": 24.482, "lng": 86.694, "state": "Jharkhand", "region": "Deoghar"},
            "description": "Located in Deoghar, Jharkhand, also known as Baba Baidyanath Dham. The temple complex consists of the main temple and 21 other temples. It is believed that Lord Shiva healed himself here.",
            "mythology": "Ravana, the demon king, performed severe penance and offered his ten heads to Lord Shiva. Pleased with his devotion, Shiva healed him and gave him invincibility. Thus, the place came to be known as Vaidyanath (Lord of Physicians).",
            "history": "The temple is an ancient shrine with references in the Puranas. The present temple structure was renovated in the 19th century. During Shravan month, millions of pilgrims (Kanwariyas) carry Ganga water to offer here.",
            "rituals": ["Jalabhishek (water offering)", "Rudrabhishek", "Evening Aarti", "Special Shravan month Kanwar yatra", "Shringar ceremony"],
            "timings": {"morning": "4:00 AM - 3:30 PM", "evening": "6:00 PM - 9:00 PM", "aarti_time": "5:00 AM & 8:00 PM", "closed_on": None},
            "stay_options": ["Temple trust dharamshalas", "Baba Baidyanath temple accommodation", "Hotels in Deoghar", "Private guest houses"],
            "food_options": ["Temple prasad", "Satvik bhojan in dharamshalas", "Local vegetarian restaurants", "North Indian cuisine restaurants"],
            "nearby_attractions": ["Naulakha Mandir", "Basukinath Temple (42 km)", "Nandan Pahar (small amusement park)", "Tapovan Hills and caves", "Rikhia Yogashram"],
            "travel_info": {"nearest_airport": "Patna Airport (281 km) or Ranchi Airport (250 km)", "nearest_railway": "Jasidih Junction (7 km)", "road_connectivity": "Connected to Patna, Ranchi, and Kolkata by road"},
            "image_url": "https://customer-assets.emergentagent.com/job_sacred-lingas/artifacts/bx88tyqo_Baidyanath.jpg",
            "best_time_to_visit": "October to March (Shravan month in July-August for Kanwar Yatra)"
        },
        {
            "id": "nageshwar",
            "name": "Nageshwar",
            "location": {"lat": 22.4667, "lng": 69.0833, "state": "Gujarat", "region": "Dwarka"},
            "description": "Located near Dwarka in Gujarat, between Gomti Creek and the Bay of Okha. The temple features a 25-meter tall statue of Lord Shiva in a seated meditation posture.",
            "mythology": "A devotee named Supriya was imprisoned by a demon Daruka. She prayed to Lord Shiva, who appeared as Nageshwar Jyotirlinga and destroyed the demon, establishing that devotees are protected by his divine presence.",
            "history": "The temple has ancient origins mentioned in the Shiva Purana. The current structure was renovated and the massive Shiva statue was installed in recent times, making it a modern architectural marvel.",
            "rituals": ["Daily abhishekam", "Rudrabhishek on Mondays", "Laghu Rudra and Maha Rudra on special occasions", "Evening aarti"],
            "timings": {"morning": "6:00 AM - 9:30 PM", "evening": "5:00 PM - 9:30 PM", "aarti_time": "7:00 AM & 7:00 PM", "closed_on": None},
            "stay_options": ["Hotels in Dwarka (17 km)", "Guest houses near temple", "Dharamshalas in Dwarka", "Beach resorts near Okha"],
            "food_options": ["Temple prasad", "Gujarati vegetarian thali", "Restaurants in Dwarka", "Fresh seafood (for non-strict vegetarians) in Okha"],
            "nearby_attractions": ["Dwarkadhish Temple (17 km)", "Bet Dwarka island", "Gopi Talav", "Rukmini Devi Temple", "Beyt Shankhodhar (marine national park)"],
            "travel_info": {"nearest_airport": "Jamnagar Airport (137 km)", "nearest_railway": "Dwarka Railway Station (17 km)", "road_connectivity": "Connected to Ahmedabad, Rajkot, and other Gujarat cities"},
            "image_url": "https://customer-assets.emergentagent.com/job_sacred-lingas/artifacts/rcwrs3xu_Nageshwar.jpg",
            "best_time_to_visit": "October to March"
        },
        {
            "id": "rameshwaram",
            "name": "Rameshwaram",
            "location": {"lat": 9.2881, "lng": 79.3129, "state": "Tamil Nadu", "region": "Ramanathapuram"},
            "description": "Located on Rameswaram island in Tamil Nadu. The temple is renowned for its magnificent architecture, long corridors, and is one of the Char Dham pilgrimage sites.",
            "mythology": "Lord Rama worshipped Shiva here to absolve himself of the sin of killing Ravana (a Brahmin). He installed a lingam made of sand, which became the Ramanathaswamy Jyotirlinga.",
            "history": "The temple was expanded during the 12th to 16th centuries by various dynasties. It has the longest corridor among all Hindu temples in India. The temple showcases Dravidian architecture with 1212 massive granite pillars.",
            "rituals": ["22 holy water tanks (theerthas) bathing ritual", "Daily six times puja", "Abhishekam with waters from different theerthas", "Special pujas during festival days"],
            "timings": {"morning": "5:00 AM - 1:00 PM", "evening": "3:00 PM - 9:00 PM", "aarti_time": "6:00 AM & 8:00 PM", "closed_on": None},
            "stay_options": ["Temple managed accommodation", "Hotels near the temple", "Beach resorts", "Tamil Nadu Tourism hotels"],
            "food_options": ["Temple prasadam", "South Indian vegetarian meals", "Tamil Nadu style thali", "Fresh seafood restaurants", "Local snack stalls"],
            "nearby_attractions": ["Dhanushkodi (India-Sri Lanka closest point)", "Pamban Bridge", "APJ Abdul Kalam Memorial", "Agnitheertham (sea bathing)", "Five-faced Hanuman Temple", "Gandhamadhana Parvatham"],
            "travel_info": {"nearest_airport": "Madurai Airport (174 km)", "nearest_railway": "Rameswaram Railway Station (2 km)", "road_connectivity": "Connected to Madurai, Chennai via Pamban Bridge"},
            "image_url": "https://customer-assets.emergentagent.com/job_sacred-lingas/artifacts/sjllcr48_Rameshwaram.jpg",
            "best_time_to_visit": "October to April"
        },
        {
            "id": "grishneshwar",
            "name": "Grishneshwar",
            "location": {"lat": 20.0647, "lng": 75.179, "state": "Maharashtra", "region": "Aurangabad"},
            "description": "Located near Ellora Caves in Maharashtra. It is the last or 12th Jyotirlinga on the list and is also called Ghushmeswara or Ghushmeshwar.",
            "mythology": "A devoted woman named Kusuma worshipped Shiva daily. Her jealous co-wife killed Kusuma's son and threw him in a lake. When Kusuma prayed to Shiva, he restored her son and appeared as Ghrishneshwar Jyotirlinga.",
            "history": "The temple was reconstructed by Maloji Raje Bhosale (grandfather of Chhatrapati Shivaji) and later by Ahilyabai Holkar in the 18th century. It features red rock architecture typical of the region.",
            "rituals": ["Abhishekam four times daily", "Rudrabhishek on Mondays and Pradosh", "Shravan month special pujas", "Evening aarti with oil lamps"],
            "timings": {"morning": "5:30 AM - 9:30 PM", "evening": "5:00 PM - 9:30 PM", "aarti_time": "7:00 AM & 7:00 PM", "closed_on": None},
            "stay_options": ["Hotels near Ellora Caves", "Aurangabad city hotels (30 km)", "Guest houses near the temple", "Maharashtra Tourism resorts"],
            "food_options": ["Temple prasad", "Maharashtrian cuisine", "Restaurants near Ellora", "Aurangabad's famous Naan Khaliya"],
            "nearby_attractions": ["Ellora Caves (UNESCO World Heritage, 0.5 km)", "Daulatabad Fort (25 km)", "Bibi Ka Maqbara (35 km)", "Ajanta Caves (100 km)", "Devgiri Fort"],
            "travel_info": {"nearest_airport": "Aurangabad Airport (30 km)", "nearest_railway": "Aurangabad Railway Station (30 km)", "road_connectivity": "Well connected to Aurangabad, Mumbai, and Pune"},
            "image_url": "https://customer-assets.emergentagent.com/job_sacred-lingas/artifacts/9eg8d274_Grihneshwar.jpg",
            "best_time_to_visit": "October to March"
        }
    ]
    
    await db.jyotirlingas.insert_many(jyotirlingas_data)
    return {"message": "Database seeded successfully", "count": len(jyotirlingas_data)}

# --- Razorpay Payment Models ---
class CreateOrderRequest(BaseModel):
    amount: int  # Amount in paise (100 paise = 1 INR)
    currency: str = "INR"
    temple_id: str
    payment_type: str  # "donation", "pooja", "travel"
    description: str
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

# --- Razorpay Endpoints ---
@api_router.post("/payments/create-order")
async def create_payment_order(order_req: CreateOrderRequest):
    try:
        receipt_id = f"{order_req.temple_id}_{order_req.payment_type}_{int(datetime.now(timezone.utc).timestamp())}"
        receipt_id = receipt_id[:40]
        
        order_id = None
        demo_mode = False
        
        if razorpay_client:
            try:
                order_data = {
                    "amount": order_req.amount,
                    "currency": order_req.currency,
                    "receipt": receipt_id,
                    "payment_capture": 1,
                }
                razorpay_order = razorpay_client.order.create(data=order_data)
                order_id = razorpay_order["id"]
            except Exception:
                demo_mode = True
                order_id = f"demo_order_{int(datetime.now(timezone.utc).timestamp())}"
        else:
            demo_mode = True
            order_id = f"demo_order_{int(datetime.now(timezone.utc).timestamp())}"
        
        # Store order in MongoDB
        payment_record = {
            "order_id": order_id,
            "amount": order_req.amount,
            "currency": order_req.currency,
            "temple_id": order_req.temple_id,
            "payment_type": order_req.payment_type,
            "description": order_req.description,
            "customer_name": order_req.customer_name,
            "customer_email": order_req.customer_email,
            "customer_phone": order_req.customer_phone,
            "status": "created",
            "demo_mode": demo_mode,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.payments.insert_one(payment_record)
        
        return {
            "order_id": order_id,
            "amount": order_req.amount,
            "currency": order_req.currency,
            "key_id": razorpay_key_id or "demo_key",
            "demo_mode": demo_mode,
        }
    except Exception as e:
        logging.error(f"Razorpay order creation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Payment order creation failed: {str(e)}")

@api_router.post("/payments/verify")
async def verify_payment(verify_req: VerifyPaymentRequest):
    # Handle demo mode
    if verify_req.razorpay_order_id.startswith("demo_"):
        await db.payments.update_one(
            {"order_id": verify_req.razorpay_order_id},
            {"$set": {
                "status": "paid",
                "payment_id": verify_req.razorpay_payment_id,
                "paid_at": datetime.now(timezone.utc).isoformat(),
            }}
        )
        return {"status": "success", "message": "Demo payment recorded successfully"}
    
    if not razorpay_client:
        raise HTTPException(status_code=500, detail="Payment gateway not configured")
    
    try:
        generated_signature = hmac.new(
            razorpay_key_secret.encode(),
            (verify_req.razorpay_order_id + "|" + verify_req.razorpay_payment_id).encode(),
            hashlib.sha256
        ).hexdigest()
        
        if generated_signature == verify_req.razorpay_signature:
            await db.payments.update_one(
                {"order_id": verify_req.razorpay_order_id},
                {"$set": {
                    "status": "paid",
                    "payment_id": verify_req.razorpay_payment_id,
                    "signature": verify_req.razorpay_signature,
                    "paid_at": datetime.now(timezone.utc).isoformat(),
                }}
            )
            return {"status": "success", "message": "Payment verified successfully"}
        else:
            await db.payments.update_one(
                {"order_id": verify_req.razorpay_order_id},
                {"$set": {"status": "failed"}}
            )
            raise HTTPException(status_code=400, detail="Payment verification failed")
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Payment verification error: {e}")
        raise HTTPException(status_code=500, detail=f"Verification error: {str(e)}")

@api_router.get("/payments/history/{temple_id}")
async def get_payment_history(temple_id: str):
    payments = await db.payments.find(
        {"temple_id": temple_id, "status": "paid"},
        {"_id": 0}
    ).to_list(100)
    return payments

app.include_router(api_router)

# --- Sitemap & Robots.txt ---
SITE_URL = os.environ.get('SITE_URL', 'https://sacred-lingas.preview.emergentagent.com')

TEMPLE_IDS = [
    "somnath", "mallikarjuna", "mahakaleshwar", "omkareshwar",
    "kedarnath", "bhimashankar", "kashi-vishwanath", "trimbakeshwar",
    "vaidyanath", "nageshwar", "rameshwaram", "grishneshwar"
]

@app.get("/sitemap.xml")
async def sitemap():
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    urls = []

    # Homepage
    urls.append(f"""  <url>
    <loc>{SITE_URL}/</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>""")

    # Individual temple pages
    for tid in TEMPLE_IDS:
        urls.append(f"""  <url>
    <loc>{SITE_URL}/temple/{tid}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>""")

    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(urls)}
</urlset>"""

    return Response(content=xml, media_type="application/xml")

@app.get("/robots.txt")
async def robots_txt():
    content = f"""User-agent: *
Allow: /

Sitemap: {SITE_URL}/sitemap.xml
"""
    return Response(content=content, media_type="text/plain")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()