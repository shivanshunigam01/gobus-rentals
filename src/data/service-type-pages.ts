export type FAQ = {
    question: string;
    answer: string;
};


export type ServiceTypePage = {
    slug: string;
    title: string;
    description: string;
    keywords: string[];

    overview: string;

    services: string[];

    benefits: string[];

    faqs: FAQ[];
};

export const SERVICE_TYPE_PAGES: readonly ServiceTypePage[] = [
    {
        slug: "corporate-bus-rental-services",
        title: "Corporate Bus Rental Services",
        description:
            "Comprehensive bus rental and employee transportation solutions for corporations, including daily pick & drop, monthly contracts, and executive shuttle services.",

        overview:
            "We provide reliable corporate transportation solutions for companies of all sizes. Our services include employee shuttle services, executive transportation, monthly contracts, and dedicated fleet solutions for offices and business parks.",

        keywords: [
            "Corporate Bus Rental India",
            "Employee Transportation Services",
            "Corporate Shuttle Services",
            "Monthly Bus Contract Services"
        ],

        services: [
            "Employee Transportation Services",
            "Daily Staff Pickup & Drop",
            "Corporate Shuttle Services",
            "Executive Transportation Services",
            "Monthly Bus Contracts",
            "Long-Term Corporate Fleet Services"
        ],

        benefits: [
            "GPS-enabled fleet",
            "Professional drivers",
            "Flexible monthly contracts",
            "Dedicated account manager",
            "Safe and reliable transportation",
            "24×7 support"
        ],

        faqs: [
            {
                question: "Do you provide monthly contracts?",
                answer:
                    "Yes, we provide long-term and monthly corporate transportation contracts."
            },
            {
                question: "Can you provide daily employee pickup and drop services?",
                answer:
                    "Yes, we offer daily employee transportation for offices and corporate campuses."
            }
        ]
    },
    {
        slug: "mnc-it-company-transportation",
        title: "MNC & IT Company Transportation",
        description: "Specialized staff transport for MNCs, IT companies, BPOs, and tech parks with GPS-enabled buses and safe night-shift transportation for women employees.",
        keywords: ["MNC Employee Transportation", "IT Company Staff Transport", "BPO & Night Shift Transportation", "GPS Enabled Corporate Buses"],
        overview:
            "Specialized transportation services for MNCs, IT companies, BPOs, and technology parks with safe and efficient staff movement.",

        services: [
            "IT Company Staff Transportation",
            "Night Shift Employee Transport",
            "BPO Transportation Services",
            "Safe Transport for Women Employees",
            "GPS Enabled Corporate Buses",
            "International Employee Transportation"
        ],

        benefits: [
            "24×7 transportation support",
            "Women employee safety",
            "GPS tracking",
            "Dedicated fleet",
            "On-time pickups",
            "Experienced drivers"
        ],

        faqs: [
            {
                question: "Do you provide night shift transportation?",
                answer:
                    "Yes, we offer safe and reliable night shift transportation services."
            },
            {
                question: "Are GPS-enabled buses available?",
                answer:
                    "Yes, all buses can be equipped with GPS tracking systems."
            }
        ]
    },
    {
        slug: "government-psu-transportation",
        title: "Government & PSU Transportation",
        description: "Official duty bus rental, election duty transportation, and contract bus services for government departments, PSUs, and state projects.",
        keywords: ["Government Transport Services", "PSU Staff Transportation", "Election Duty Transportation", "State Transport Contract Bus"],
        overview:
            "Reliable transportation services for government departments, PSUs, election duties, and official projects.",

        services: [
            "Government Staff Transportation",
            "Election Duty Transportation",
            "Official Delegation Transport",
            "Government Project Transport",
            "Contract Bus Services"
        ],

        benefits: [
            "Experienced drivers",
            "Flexible contracts",
            "Well-maintained fleet",
            "Reliable scheduling",
            "Suitable for official duties"
        ],

        faqs: [
            {
                question: "Do you provide buses for election duties?",
                answer:
                    "Yes, we provide transportation for election and government projects."
            },
            {
                question: "Can government departments hire buses on contract?",
                answer:
                    "Yes, long-term and project-based contracts are available."
            }
        ]
    },
    {
        slug: "industrial-factory-transportation",
        title: "Industrial & Factory Transportation",
        description: "Multi-shift employee pickup & drop for factories, manufacturing plants, construction sites, and labour camps with dedicated industrial staff transport.",
        keywords: ["Factory Staff Transportation", "Industrial Staff Transport", "Manufacturing Plant Transportation", "Construction Worker Bus Service"],
        overview:
            "Employee transportation solutions for factories, manufacturing plants, construction sites, and labour camps.",

        services: [
            "Factory Staff Transportation",
            "Multi-Shift Employee Pickup & Drop",
            "Construction Worker Transport",
            "Labour Camp Transportation",
            "Manufacturing Plant Transportation"
        ],

        benefits: [
            "Multi-shift support",
            "Timely pickup and drop",
            "Large fleet availability",
            "Affordable contracts",
            "Reliable operations"
        ],

        faqs: [
            {
                question: "Do you provide transport for factory workers?",
                answer:
                    "Yes, we provide dedicated transportation for factories and industrial units."
            },
            {
                question: "Can buses be scheduled for multiple shifts?",
                answer:
                    "Yes, we support morning, evening, and night shifts."
            }
        ]
    },
    {
        slug: "aviation-airport-transportation",
        title: "Aviation & Airport Transportation",
        description: "Dedicated transport for airline crew, pilots, cabin crew, and airport ground staff along with international guest transfers at airports.",
        keywords: ["Airline Crew Transportation", "Pilot & Cabin Crew Transfers", "Airport Staff Shuttle Services", "Airport Transfers for International Guests"],
        overview:
            "Dedicated transportation services for airline crew, pilots, cabin crew, airport staff, and international guests.",

        services: [
            "Airline Crew Transportation",
            "Pilot Transfers",
            "Cabin Crew Pickup & Drop",
            "Ground Staff Transportation",
            "Airport Guest Transfers"
        ],

        benefits: [
            "24×7 availability",
            "Professional chauffeurs",
            "Timely pickups",
            "Comfortable buses",
            "Safe transportation"
        ],

        faqs: [
            {
                question: "Do you provide transport for airline crew?",
                answer:
                    "Yes, we provide transportation services for pilots and cabin crew."
            },
            {
                question: "Can international guests be accommodated?",
                answer:
                    "Yes, we provide airport transfers for business and foreign guests."
            }
        ]
    },
    {
        slug: "port-logistics-warehouse-transportation",
        title: "Port, Logistics & Warehouse Transportation",
        description:
            "Staff transportation for ports, container yards, logistics hubs, and warehouses with dedicated employee pickup and drop services.",

        overview:
            "We provide reliable transportation solutions for ports, logistics companies, warehouses, shipping companies, and container yards. Our services ensure safe and timely employee movement with dedicated fleet support.",

        keywords: [
            "Port Staff Transportation",
            "Warehouse Staff Transportation",
            "Logistics Employee Transport",
            "Container Yard Staff Bus"
        ],

        services: [
            "Port Staff Transportation",
            "Warehouse Employee Pickup & Drop",
            "Container Yard Staff Bus Services",
            "Shipping Company Staff Transport",
            "Logistics Staff Shuttle Services"
        ],

        benefits: [
            "24×7 transportation support",
            "Timely employee pickup and drop",
            "Dedicated fleet solutions",
            "Professional drivers",
            "Flexible transportation contracts"
        ],

        faqs: [
            {
                question: "Do you provide transportation for warehouse employees?",
                answer:
                    "Yes, we offer reliable pickup and drop services for warehouse and logistics staff."
            },
            {
                question: "Can shipping companies hire buses on contract?",
                answer:
                    "Yes, we provide both short-term and long-term transportation contracts."
            }
        ]
    },
    {
        slug: "oil-gas-refinery-transportation",
        title: "Oil, Gas & Refinery Transportation",
        description:
            "Project site transport for oil & gas industries, refineries, EPC projects, shutdown projects, and mining operations including ONGC and IOCL projects.",

        overview:
            "We specialize in transportation solutions for oil and gas industries, refineries, EPC projects, mining operations, and shutdown projects. Our services are designed to support industrial and project-based workforce mobility.",

        keywords: [
            "Refinery Staff Transportation",
            "Oil & Gas Industry Transportation",
            "EPC Project Transportation",
            "Mining Project Employee Transport"
        ],

        services: [
            "Oil & Gas Employee Transport",
            "Refinery Staff Transportation",
            "EPC Project Transportation",
            "Shutdown Project Bus Rental",
            "Mining Staff Transportation",
            "Project Site Staff Transport"
        ],

        benefits: [
            "Reliable transportation for remote locations",
            "Support for multi-shift operations",
            "Experienced drivers",
            "Large fleet availability",
            "Long-term project contracts"
        ],

        faqs: [
            {
                question: "Do you provide buses for refinery projects?",
                answer:
                    "Yes, we provide transportation solutions for refineries, EPC projects, and shutdown operations."
            },
            {
                question: "Can mining projects arrange dedicated staff transport?",
                answer:
                    "Yes, dedicated buses and long-term contracts are available for mining and industrial projects."
            }
        ]
    },
    {
        slug: "healthcare-hospital-transportation",
        title: "Healthcare & Hospital Transportation",
        description: "Shuttle services for hospital staff, medical teams, and nurses with reliable pickup and drop for healthcare employees.",
        keywords: ["Hospital Staff Transportation", "Medical Staff Shuttle", "Nurse Pickup and Drop", "Healthcare Employee Transport"],
        overview:
            "Reliable shuttle services for hospitals, medical teams, nurses, and healthcare professionals.",

        services: [
            "Hospital Staff Transportation",
            "Medical Team Shuttle Services",
            "Nurse Pickup & Drop",
            "Healthcare Employee Transport"
        ],

        benefits: [
            "24×7 availability",
            "Safe transportation",
            "Timely pickups",
            "Dedicated vehicles",
            "Professional drivers"
        ],

        faqs: [
            {
                question: "Do you provide transportation for nurses?",
                answer:
                    "Yes, we provide safe pickup and drop services for nurses and healthcare staff."
            },
            {
                question: "Can hospitals arrange monthly contracts?",
                answer:
                    "Yes, long-term transportation contracts are available."
            }
        ]
    },
    {
        slug: "education-transportation-services",
        title: "Education Transportation Services",
        description: "Safe school bus rental, college/university shuttle services, and student pickup & drop including educational tour bus rentals.",
        keywords: ["School Bus Rental", "College Transportation Service", "Safe Student Pickup & Drop", "Educational Tour Bus Rental"],
        overview:
            "Safe transportation solutions for schools, colleges, universities, and educational tours.",

        services: [
            "School Bus Rental",
            "College Transportation Services",
            "University Shuttle Services",
            "Educational Tour Bus Rental"
        ],

        benefits: [
            "Student safety",
            "GPS-enabled buses",
            "Professional drivers",
            "Affordable pricing",
            "Flexible scheduling"
        ],

        faqs: [
            {
                question: "Do you provide buses for educational tours?",
                answer:
                    "Yes, buses are available for school and college tours."
            },
            {
                question: "Are student safety measures provided?",
                answer:
                    "Yes, we prioritize safety and maintain well-equipped buses."
            }
        ]
    },
    {
        slug: "event-tourism-hospitality-transportation",
        title: "Event, Tourism & Hospitality Transportation",
        description: "Corporate event bus rental, conference delegate transport, tourist bus services, luxury coach hire, and hotel staff transportation.",
        keywords: ["Corporate Event Bus Rental", "Tourist Bus Rental Service", "Luxury Coach Rental India", "Hotel Staff Transportation"],
        overview:
            "Premium transportation solutions for conferences, corporate events, tourism, hotels, and group travel.",

        services: [
            "Corporate Event Bus Rental",
            "Conference Delegate Transport",
            "Tourist Bus Services",
            "Luxury Coach Hire",
            "Hotel Staff Transportation"
        ],

        benefits: [
            "Luxury fleet options",
            "Professional drivers",
            "Comfortable travel",
            "Group transportation",
            "Custom travel plans"
        ],

        faqs: [
            {
                question: "Do you provide buses for corporate events?",
                answer:
                    "Yes, we offer buses and coaches for conferences and corporate gatherings."
            },
            {
                question: "Can foreign tourists hire buses?",
                answer:
                    "Yes, we provide transportation services for international visitors."
            }
        ]
    },
    {
        slug: "international-guest-foreign-delegate-transportation",
        title: "International Guest & Foreign Delegate Transportation",
        description:
            "Overseas client transport, NRI guest transportation, foreign tourist services, embassy staff transport, and international business visitor transport.",

        overview:
            "We provide premium transportation services for international guests, foreign delegates, overseas clients, embassy staff, and business visitors with comfortable and professional travel arrangements.",

        keywords: [
            "Overseas Client Transport Services",
            "Foreign Tourist Transport Services",
            "Embassy Staff Transportation",
            "International Business Visitor Transport"
        ],

        services: [
            "Foreign Delegate Transportation",
            "NRI Guest Transportation",
            "Embassy Staff Transport",
            "International Business Visitor Transport",
            "Airport Pickup & Drop Services",
            "VIP Guest Transfers"
        ],

        benefits: [
            "Professional chauffeurs",
            "Luxury transportation options",
            "Comfortable travel experience",
            "Airport transfer support",
            "Reliable and punctual service"
        ],

        faqs: [
            {
                question: "Do you provide transportation for foreign delegates?",
                answer:
                    "Yes, we offer dedicated transportation services for international guests and business visitors."
            },
            {
                question: "Can airport pickup services be arranged for overseas clients?",
                answer:
                    "Yes, we provide airport pickup and drop services for foreign guests and delegates."
            }
        ]
    },
    {
        slug: "industry-wise-target-transportation",
        title: "Industry-Wise Target Transportation",
        description:
            "Customized transportation solutions for IT companies, factories, ports, refineries, airports, mining projects, government projects, warehouses, hospitals, and manufacturing plants.",

        overview:
            "We provide customized transportation solutions across multiple industries including IT companies, factories, hospitals, ports, airports, refineries, mining projects, warehouses, and government organizations.",

        keywords: [
            "IT Companies Transportation",
            "Factories Staff Transportation",
            "Refineries Staff Transport",
            "Manufacturing Plants Transportation"
        ],

        services: [
            "IT Company Transportation",
            "Factory Staff Transportation",
            "Hospital Employee Transport",
            "Port & Logistics Staff Transport",
            "Airport Employee Transportation",
            "Mining Project Transportation",
            "Government Project Transport",
            "Manufacturing Plant Transportation"
        ],

        benefits: [
            "Industry-specific transportation solutions",
            "Flexible fleet options",
            "Professional drivers",
            "GPS-enabled buses",
            "Long-term transportation contracts",
            "Nationwide service support"
        ],

        faqs: [
            {
                question: "Which industries do you serve?",
                answer:
                    "We serve IT companies, factories, hospitals, airports, ports, government organizations, refineries, warehouses, and manufacturing plants."
            },
            {
                question: "Do you provide customized transportation solutions?",
                answer:
                    "Yes, we tailor our transportation services according to the requirements of each industry."
            }
        ]
    }
];

export function getServiceTypePageBySlug(slug: string): ServiceTypePage | undefined {
    return SERVICE_TYPE_PAGES.find((p) => p.slug === slug);
}

export function listServiceTypeSlugs(): string[] {
    return SERVICE_TYPE_PAGES.map((p) => p.slug);
}
