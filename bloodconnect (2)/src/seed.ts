import { collection, addDoc, getDocs, query, limit, deleteDoc, doc } from 'firebase/firestore';
import { db } from './lib/firebase';

const sampleCenters = [
  {
    name: "Centre de Transfusion Sanguine - El Jadida",
    address: "Hôpital Mohammed V, Avenue Mohammed V",
    city: "El Jadida",
    phone: "05 23 34 22 22",
    openingHours: "Lun-Ven: 08:30 - 16:30",
    location: { lat: 33.2316, lng: -8.5007 }
  },
  {
    name: "Banque de Sang - Clinique de la Plage",
    address: "Avenue de la Plage",
    city: "El Jadida",
    phone: "05 23 35 10 10",
    openingHours: "24h/24 (Urgences)",
    location: { lat: 33.2512, lng: -8.4950 }
  },
  {
    name: "Point de Collecte Mobile - Place Moulay Hassan",
    address: "Place Moulay Hassan (Centre-ville)",
    city: "El Jadida",
    phone: "05 23 34 00 00",
    openingHours: "Sam-Dim: 10:00 - 18:00",
    location: { lat: 33.2555, lng: -8.5050 }
  }
];

export async function seedDonationCenters(force = false) {
  const allDocs = await getDocs(collection(db, 'donationCenters'));
  const isOldData = allDocs.docs.some(d => d.data().city === 'Paris' || d.data().city === 'Lyon');
  
  if (allDocs.empty || force || isOldData) {
    console.log('Clearing old or existing centers...');
    for (const d of allDocs.docs) {
      await deleteDoc(doc(db, 'donationCenters', d.id));
    }

    console.log('Seeding donation centers for El Jadida...');
    for (const center of sampleCenters) {
      await addDoc(collection(db, 'donationCenters'), center);
    }
    console.log('Seeding complete.');
  }
}
