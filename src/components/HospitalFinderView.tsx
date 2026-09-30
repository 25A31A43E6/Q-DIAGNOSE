import React, { useState, useEffect } from 'react';
import { 
  Hospital, 
  MapPin, 
  PhoneCall, 
  Search, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  FileCheck,
  X,
  User,
  AlertCircle
} from 'lucide-react';
import { SupportedLanguage } from '../types';

interface HospitalFinderViewProps {
  onBackToGuidance: () => void;
  onGoToHome: () => void;
  lang?: SupportedLanguage;
}

export interface Specialist {
  id: string;
  name: string;
  department: string;
  designation: string;
  experience: string;
  fee: string;
  availableDays: string[];
}

export interface MedicalFacility {
  id: string;
  name: string;
  type: 'Trauma & Emergency' | 'Multispecialty' | 'Cardiology' | 'Oncology' | 'Neurology';
  distance: string;
  phone: string;
  address: string;
  emergency24_7: boolean;
  specialties: string[];
  openHours: string;
  rating: number;
  specialists: Specialist[];
}

export interface BookedAppointment {
  id: string;
  facilityId: string;
  facilityName: string;
  specialistId: string;
  specialistName: string;
  department: string;
  date: string;
  timeSlot: string;
  consultationType: 'In-Person OPD' | 'Tele-Consultation';
  patientName: string;
  patientPhone: string;
  patientNotes: string;
  status: 'Confirmed' | 'Pending Review' | 'Cancelled';
  tokenNumber: string;
  createdAt: string;
}

export const HospitalFinderView: React.FC<HospitalFinderViewProps> = ({
  onBackToGuidance,
  onGoToHome,
  lang = 'en'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Appointment Booking State
  const [selectedFacilityForBooking, setSelectedFacilityForBooking] = useState<MedicalFacility | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [consultationType, setConsultationType] = useState<'In-Person OPD' | 'Tele-Consultation'>('In-Person OPD');
  const [bookingDate, setBookingDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [bookingTimeSlot, setBookingTimeSlot] = useState<string>('10:00 AM - 10:30 AM');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientNotes, setPatientNotes] = useState('Follow-up review of Q-Diagnose screening results.');
  const [attachReport, setAttachReport] = useState(true);
  const [bookingSuccessModal, setBookingSuccessModal] = useState<BookedAppointment | null>(null);

  // Appointments Database state
  const [bookedAppointments, setBookedAppointments] = useState<BookedAppointment[]>(() => {
    try {
      const saved = localStorage.getItem('qdiagnose_booked_appointments');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('qdiagnose_booked_appointments', JSON.stringify(bookedAppointments));
    } catch (e) {
      console.error('Failed to sync booked appointments:', e);
    }
  }, [bookedAppointments]);

  const facilities: MedicalFacility[] = [
    {
      id: 'hosp-1',
      name: 'City Apex Multidisciplinary Hospital & Level-1 Trauma Center',
      type: 'Trauma & Emergency',
      distance: '1.4 km',
      phone: '+91 11 2659 3444',
      address: 'Ring Road, Near Metro Interchange, Medical Enclave',
      emergency24_7: true,
      specialties: ['24/7 Emergency Trauma', 'Cardiac Cath Lab', 'Neuro Intensive Care', 'Diagnostic Imaging'],
      openHours: 'Open 24 Hours (ER Active)',
      rating: 4.8,
      specialists: [
        {
          id: 'spec-101',
          name: 'Dr. Aris Thorne',
          department: 'Neurotrauma & Critical Care',
          designation: 'Senior Consultant & HOD',
          experience: '18 years',
          fee: '₹1,200',
          availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
        },
        {
          id: 'spec-102',
          name: 'Dr. Nandini Sen',
          department: 'Emergency & Acute Care Medicine',
          designation: 'Attending Emergency Physician',
          experience: '12 years',
          fee: '₹1,000',
          availableDays: ['Mon', 'Wed', 'Fri', 'Sat']
        }
      ]
    },
    {
      id: 'hosp-2',
      name: 'National Heart & Vascular Research Institute',
      type: 'Cardiology',
      distance: '2.8 km',
      phone: '+91 11 4713 5000',
      address: 'Community Center, East Wing Boulevard',
      emergency24_7: true,
      specialties: ['Interventional Cardiology', 'Electrophysiology', 'Hypertension Clinic', 'Echocardiography'],
      openHours: 'OPD: 8:00 AM - 7:00 PM | ER: 24/7',
      rating: 4.9,
      specialists: [
        {
          id: 'spec-201',
          name: 'Dr. Alok Mathur',
          department: 'Interventional Cardiology',
          designation: 'Director of Cardiac Catheterization',
          experience: '22 years',
          fee: '₹1,500',
          availableDays: ['Mon', 'Tue', 'Thu', 'Sat']
        },
        {
          id: 'spec-202',
          name: 'Dr. Maya Pillai',
          department: 'Preventive Cardiology & Lipidology',
          designation: 'Consultant Cardiologist',
          experience: '14 years',
          fee: '₹1,100',
          availableDays: ['Tue', 'Wed', 'Fri']
        }
      ]
    },
    {
      id: 'hosp-3',
      name: 'Metropolitan Cancer Foundation & Diagnostics Lab',
      type: 'Oncology',
      distance: '4.1 km',
      phone: '+91 11 4173 0100',
      address: 'Phase III, Institutional Area, Sector 6',
      emergency24_7: false,
      specialties: ['Cellular Pathology', 'Mammography & Biopsy', 'Surgical Oncology', 'Preventive Screening'],
      openHours: '8:00 AM - 8:00 PM (Mon-Sat)',
      rating: 4.7,
      specialists: [
        {
          id: 'spec-301',
          name: 'Dr. Rohan Mukherjee',
          department: 'Clinical Oncology & Tumor Board',
          designation: 'Chief Oncologist',
          experience: '20 years',
          fee: '₹1,600',
          availableDays: ['Mon', 'Wed', 'Fri']
        },
        {
          id: 'spec-302',
          name: 'Dr. Farah Siddiqui',
          department: 'Breast Pathology & Diagnostic Imaging',
          designation: 'Consultant Radiologist & Pathologist',
          experience: '11 years',
          fee: '₹1,200',
          availableDays: ['Tue', 'Thu', 'Sat']
        }
      ]
    },
    {
      id: 'hosp-4',
      name: 'Regional Brain, Spine & Movement Disorder Center',
      type: 'Neurology',
      distance: '3.6 km',
      phone: '+91 11 2987 1200',
      address: 'Health Sciences Corridor, Gate 3',
      emergency24_7: true,
      specialties: ['Movement Disorders', 'EMG & Nerve Conduction', 'Tremor Analysis', 'Sleep Neurology'],
      openHours: 'OPD: 9:00 AM - 6:00 PM | ER: 24/7',
      rating: 4.6,
      specialists: [
        {
          id: 'spec-401',
          name: 'Dr. Preeti Deshmukh',
          department: 'Movement Disorders & Neurology',
          designation: 'Senior Consultant Neurologist',
          experience: '16 years',
          fee: '₹1,400',
          availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
        },
        {
          id: 'spec-402',
          name: 'Dr. Vikram Rao',
          department: 'Neuro-Electrophysiology',
          designation: 'Specialist in Nerve Conduction & EMG',
          experience: '13 years',
          fee: '₹1,200',
          availableDays: ['Mon', 'Wed', 'Sat']
        }
      ]
    },
    {
      id: 'hosp-5',
      name: 'Grace Community Healthcare & Family Health Clinic',
      type: 'Multispecialty',
      distance: '1.1 km',
      phone: '+91 11 2345 6789',
      address: 'Main Market Avenue, Block B',
      emergency24_7: false,
      specialties: ['General Medicine', 'Preventive Health Checks', 'Routine Lab Panels', 'Family Practice'],
      openHours: '8:30 AM - 8:30 PM (Daily)',
      rating: 4.5,
      specialists: [
        {
          id: 'spec-501',
          name: 'Dr. Sangeeta Verma',
          department: 'Internal Medicine & Preventive Care',
          designation: 'Senior Family Physician',
          experience: '15 years',
          fee: '₹800',
          availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        }
      ]
    }
  ];

  const filtered = facilities.filter(f => {
    const matchesSearch = 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'emergency') return matchesSearch && f.emergency24_7;
    if (selectedFilter === 'cardio') return matchesSearch && f.type === 'Cardiology';
    if (selectedFilter === 'onco') return matchesSearch && f.type === 'Oncology';
    if (selectedFilter === 'neuro') return matchesSearch && f.type === 'Neurology';
    return matchesSearch;
  });

  const handleOpenBookingModal = (facility: MedicalFacility, specialist?: Specialist) => {
    setSelectedFacilityForBooking(facility);
    setSelectedSpecialist(specialist || facility.specialists[0] || null);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacilityForBooking || !selectedSpecialist || !patientName.trim()) return;

    const tokenNum = `QD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newAppointment: BookedAppointment = {
      id: `apt-${Date.now()}`,
      facilityId: selectedFacilityForBooking.id,
      facilityName: selectedFacilityForBooking.name,
      specialistId: selectedSpecialist.id,
      specialistName: selectedSpecialist.name,
      department: selectedSpecialist.department,
      date: bookingDate,
      timeSlot: bookingTimeSlot,
      consultationType,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim() || 'N/A',
      patientNotes: patientNotes.trim(),
      status: 'Confirmed',
      tokenNumber: tokenNum,
      createdAt: new Date().toLocaleString()
    };

    setBookedAppointments(prev => [newAppointment, ...prev]);
    setSelectedFacilityForBooking(null);
    setBookingSuccessModal(newAppointment);
  };

  const handleCancelAppointment = (id: string) => {
    setBookedAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* 6-Step Flow Stepper */}
      <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-500 overflow-x-auto gap-2 pb-2">
          <button onClick={onGoToHome} className="hover:text-[#0B1E3D] flex items-center gap-1.5 shrink-0 text-slate-600 cursor-pointer">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">1</span>
            <span>Home</span>
          </button>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">2</span>
            <span>Emergency Check</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">3</span>
            <span>Assessment</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">4</span>
            <span>Prediction</span>
          </div>
          <span className="text-slate-300">→</span>
          <button onClick={onBackToGuidance} className="hover:text-[#0B1E3D] flex items-center gap-1.5 shrink-0 text-slate-600 cursor-pointer">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">5</span>
            <span>Guidance</span>
          </button>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 shrink-0 text-teal-700 font-bold bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">6</span>
            <span>Doctor & Hospital Finder</span>
          </div>
        </div>
      </div>

      {/* Scheduled Appointments Drawer Banner */}
      {bookedAppointments.length > 0 && (
        <div className="bg-white rounded-2xl border border-teal-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                Active Bookings
              </span>
              <h3 className="text-base font-bold text-[#0B1E3D]">
                My Scheduled Specialist Consultations ({bookedAppointments.filter(a => a.status === 'Confirmed').length})
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Interoperable EMR Linked
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {bookedAppointments.map(apt => (
              <div 
                key={apt.id} 
                className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                  apt.status === 'Cancelled'
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-teal-50/50 border-teal-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0B1E3D] text-sm">{apt.specialistName}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {apt.status}
                  </span>
                </div>
                <div className="text-slate-600 space-y-0.5">
                  <p><strong className="text-slate-700">Hospital:</strong> {apt.facilityName}</p>
                  <p><strong className="text-slate-700">Slot:</strong> {apt.date} • {apt.timeSlot}</p>
                  <p><strong className="text-slate-700">Mode:</strong> {apt.consultationType}</p>
                  <p><strong className="text-slate-700">Token ID:</strong> <span className="font-mono font-bold text-teal-800">{apt.tokenNumber}</span></p>
                </div>

                {apt.status === 'Confirmed' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleCancelAppointment(apt.id)}
                      className="text-[11px] font-bold text-rose-700 hover:text-rose-900 cursor-pointer"
                    >
                      Cancel Consultation
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Step 6 of 6: Connect with Care
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1E3D] mt-1.5 tracking-tight">
              Nearby Hospitals, Trauma Centers & Specialist Follow-ups
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Find qualified facilities to discuss your screening results, undergo confirmatory clinical testing, or book a specialist consultation directly.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-[#0B1E3D] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                viewMode === 'map' ? 'bg-white text-[#0B1E3D] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Map View
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by hospital name, specialty, or area..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/30 text-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Centers' },
              { id: 'emergency', label: '24/7 ER Only' },
              { id: 'cardio', label: 'Cardiology' },
              { id: 'onco', label: 'Oncology' },
              { id: 'neuro', label: 'Neurology' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilter === f.id
                    ? 'bg-[#0B1E3D] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' ? (
        <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm space-y-4 animate-fadeIn">
          <div className="relative w-full h-80 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-50 via-slate-100 to-teal-50 opacity-90">
              <div className="w-full h-full relative">
                {/* Simulated Map Markers */}
                <div className="absolute top-12 left-1/4 flex flex-col items-center">
                  <div className="p-2 bg-rose-600 text-white rounded-full shadow-lg">
                    <Hospital className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-white text-slate-800 px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                    City Apex Trauma (1.4 km)
                  </span>
                </div>

                <div className="absolute bottom-10 right-8 flex flex-col items-center">
                  <div className="p-2 bg-teal-600 text-white rounded-full shadow-lg">
                    <Hospital className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-white text-slate-800 px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                    National Heart (2.8 km)
                  </span>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full ring-4 ring-blue-300 animate-ping" />
                  <span className="text-[10px] font-bold bg-blue-900 text-white px-2 py-0.5 rounded-full mt-2">
                    Your Current Location
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600">
              Showing {filtered.length} verified centers within 5 km radius
            </div>
          </div>
        </div>
      ) : null}

      {/* Facilities List Cards */}
      <div className="space-y-4">
        {filtered.map(facility => (
          <div
            key={facility.id}
            className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  facility.emergency24_7 ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-teal-50 text-teal-600 border border-teal-200'
                }`}>
                  <Hospital className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-bold text-[#0B1E3D]">
                      {facility.name}
                    </h3>
                    {facility.emergency24_7 && (
                      <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
                        24/7 ER Available
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-teal-700">
                      <MapPin className="w-3.5 h-3.5" /> {facility.distance} away
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3.5 h-3.5" /> {facility.openHours}
                    </span>
                    <span>•</span>
                    <span className="text-slate-800 font-bold">{facility.rating} / 5.0 Rating</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-2 sm:mt-0 shrink-0">
                <button
                  onClick={() => handleOpenBookingModal(facility)}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <span>Book Specialist Follow-up</span>
                </button>

                <a
                  href={`tel:${facility.phone}`}
                  className="bg-slate-100 hover:bg-slate-200 text-[#0B1E3D] font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-300 transition-all cursor-pointer"
                >
                  <span>Call Hospital</span>
                </a>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              <strong className="text-slate-700">Address:</strong> {facility.address}
            </p>

            {/* Specialist Roster Quick View */}
            {facility.specialists && facility.specialists.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  Available On-Duty Specialists:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {facility.specialists.map(sp => (
                    <div key={sp.id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                      <div>
                        <span className="font-bold text-[#0B1E3D]">{sp.name}</span>
                        <p className="text-[11px] text-slate-500">{sp.department} • {sp.experience}</p>
                      </div>
                      <button
                        onClick={() => handleOpenBookingModal(facility, sp)}
                        className="text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-2 py-1 rounded-md cursor-pointer shrink-0"
                      >
                        Select Slot
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-medium">Specialties:</span>
              {facility.specialties.map((spec, idx) => (
                <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            No medical centers match your search filter. Try clearing the filter or searching for another term.
          </div>
        )}
      </div>

      {/* Appointment Preparation Guide */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <FileCheck className="w-6 h-6 text-teal-600" />
          <h3 className="text-lg font-bold text-[#0B1E3D]">
            What to Bring to Your Appointment
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Government ID and Health Insurance documentation</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Printed or saved copy of your Q-Diagnose screening report</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>List of current daily prescriptions and dietary supplements</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Any recent laboratory blood work or diagnostic imaging</span>
          </div>
        </div>
      </div>

      {/* Complete Flow Return Button */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBackToGuidance}
          className="flex items-center justify-center px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-all cursor-pointer"
        >
          <span>Back to Step 5: Guidance</span>
        </button>

        <button
          id="finish-flow-return-home-btn"
          onClick={onGoToHome}
          className="flex items-center justify-center bg-[#0B1E3D] hover:bg-[#132c54] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          <span>Completed — Return to Home Dashboard</span>
        </button>
      </div>

      {/* Appointment Booking Modal */}
      {selectedFacilityForBooking && selectedSpecialist && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  Specialist Consultation Booking
                </span>
                <h3 className="text-lg font-bold text-[#0B1E3D]">
                  {selectedFacilityForBooking.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedFacilityForBooking(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
              {/* Specialist Selection */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Choose Specialist Physician:</label>
                <select
                  value={selectedSpecialist.id}
                  onChange={e => {
                    const found = selectedFacilityForBooking.specialists.find(s => s.id === e.target.value);
                    if (found) setSelectedSpecialist(found);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                >
                  {selectedFacilityForBooking.specialists.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.department} • {s.fee})
                    </option>
                  ))}
                </select>
              </div>

              {/* Consultation Type */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Consultation Format:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConsultationType('In-Person OPD')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      consultationType === 'In-Person OPD'
                        ? 'bg-teal-50 border-teal-500 text-teal-900'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    In-Person Hospital OPD
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultationType('Tele-Consultation')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      consultationType === 'Tele-Consultation'
                        ? 'bg-teal-50 border-teal-500 text-teal-900'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Secure Video Tele-Consult
                  </button>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Preferred Date:</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Available Time Slot:</label>
                  <select
                    value={bookingTimeSlot}
                    onChange={e => setBookingTimeSlot(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="09:00 AM - 09:30 AM">09:00 AM - 09:30 AM</option>
                    <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                    <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                    <option value="02:30 PM - 03:00 PM">02:30 PM - 03:00 PM</option>
                    <option value="04:30 PM - 05:00 PM">04:30 PM - 05:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Patient Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Patient Full Name:</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Mobile / WhatsApp Number:</label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={e => setPatientPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* Reason / Notes */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Clinical Focus / Symptoms for Physician:</label>
                <textarea
                  rows={2}
                  value={patientNotes}
                  onChange={e => setPatientNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              {/* Checkbox to Attach Q-Diagnose Summary */}
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attachReport}
                  onChange={e => setAttachReport(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-slate-700 font-medium">
                  Share Q-Diagnose early screening metrics with attending physician
                </span>
              </label>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedFacilityForBooking(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold cursor-pointer shadow-sm"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Success Confirmation Modal */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-teal-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Booking Confirmed
              </span>
              <h3 className="text-xl font-bold text-[#0B1E3D] mt-1">
                Specialist Appointment Scheduled
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your consultation request has been registered in the clinical appointment scheduling system.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Token ID:</span>
                <span className="font-mono font-bold text-teal-800">{bookingSuccessModal.tokenNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Physician:</span>
                <span className="font-bold text-slate-800">{bookingSuccessModal.specialistName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hospital:</span>
                <span className="text-slate-800">{bookingSuccessModal.facilityName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Slot:</span>
                <span className="text-slate-800">{bookingSuccessModal.date} ({bookingSuccessModal.timeSlot})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Format:</span>
                <span className="text-slate-800">{bookingSuccessModal.consultationType}</span>
              </div>
            </div>

            <button
              onClick={() => setBookingSuccessModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#0B1E3D] hover:bg-[#132c54] text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              Done & View Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
