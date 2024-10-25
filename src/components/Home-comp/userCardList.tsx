import { useState, useEffect } from 'react'
import { UserCard } from './userCard'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { client } from "../../utils/utils"
import { Loader2, Check, ChevronsUpDown } from "lucide-react"
import { MessageGrid } from './messageGrid'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Textarea } from "@/components/ui/textarea"
import { Schema } from "../../../amplify/data/resource"
import { Separator } from "@/components/ui/separator"

// const mockGeneratedMessages = 
// [
//   {
//       "user": {
//           "object": "UserProfile",
//           "provider": "LINKEDIN",
//           "provider_id": "ACoAAADBRqUBODWdflodPhrAoF3Icx2XHlstGSY",
//           "public_identifier": "kiril-minoski-phd-2052aa4",
//           "first_name": "Kiril",
//           "last_name": "Minoski, PhD",
//           "headline": "Former Minister of Finance | Expert in International Development & Institutional ReformStrategic Leader in Finance & Public Sector Development | Experienced in Global Project Management & Policy Creation",
//           "primary_locale": {
//               "country": "US",
//               "language": "en"
//           },
//           "is_open_profile": false,
//           "is_premium": false,
//           "is_influencer": false,
//           "is_creator": false,
//           "is_relationship": false,
//           "network_distance": "SECOND_DEGREE",
//           "is_self": false,
//           "websites": [],
//           "follower_count": 1868,
//           "connections_count": 1864,
//           "location": "Skopje, Skopje Statistical Region, North Macedonia",
//           "profile_picture_url": "https://media.licdn.com/dms/image/v2/D4E03AQHANA9sM2tB7g/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1723332964796?e=1735171200&v=beta&t=_jblYDKbIgMaobIN4YqCz4o0i7PTGXWMjT8-ir8Pqpk",
//           "education": [
//               {
//                   "degree": "PhD, Economics",
//                   "school": "Faculty of Economics, Skopje, University",
//                   "start": "1/1/2014",
//                   "end": "1/1/2019"
//               },
//               {
//                   "degree": "MSc, Economics",
//                   "school": "St. Cyril and Methodius",
//                   "start": "1/1/2003",
//                   "end": "1/1/2005"
//               },
//               {
//                   "degree": "BSc, Economics (major in Management)",
//                   "school": "Ss. Cyril and Methodius University, Faculty of Economics, Skopje, N. Macedonia, 1992",
//                   "start": "1/1/1992",
//                   "end": "1/1/1996"
//               }
//           ],
//           "work_experience": [
//               {
//                   "company": "World Bank Project - New Single  Window (NSW)  Programme  Management  Support ",
//                   "position": "Deputy Team Leader/Change Management Expert ",
//                   "location": "Skopje, Skopje Statistical Region, North Macedonia",
//                   "description": "- Led the World Bank-funded project as Deputy Team Leader, focusing on enhancing public finance management through strategic change management and project oversight.\n- Managed the development and implementation of a comprehensive change management plan, ensuring successful transformation and continuous improvement by measuring change effectiveness.\n- Spearheaded the creation of legal frameworks for establishing the New Single Window, while implementing communication and training strategies to foster a cohesive and adaptable organizational environment.",
//                   "start": "3/1/2023",
//                   "end": null
//               },
//               {
//                   "company": "World Bank Project - Functional Analysis for the Pension and Disability Insurance Fund ",
//                   "position": "Team Leader ",
//                   "location": "Skopje Statistical Region, North Macedonia · On-site",
//                   "description": "- Spearheaded the analysis and redesign of business processes and organizational structures within the Pension and Disability Insurance Fund (PDIF), aligning them with the organization's objectives and enhancing operational efficiency.\n- Led the development and implementation of a comprehensive change management strategy, including a Training Needs Analysis and Training Plan, to ensure smooth transition and adoption of new processes and systems.\n- Collaborated on the design and deployment of advanced software solutions and hardware optimizations, significantly improving the PDIF's service delivery capabilities and overall performance.",
//                   "start": "10/1/2022",
//                   "end": null
//               },
//               {
//                   "company": "ETC Consulting ",
//                   "position": "Chief Executive Officer",
//                   "location": "Skopje, Skopje Statistical Region, North Macedonia · On-site",
//                   "description": "- Led Financial Management Consulting, Change Management, and Workforce Development initiatives, driving organizational optimization and performance improvement.\n- Served as a European Bank for Reconstruction and Development Consultant for private sector development, enhancing business growth through the EBRD TAM/BAS Programme and the EU Enterprise Development & Innovation Facility (EDIF).\n- Directed comprehensive services in Tax Advisory, Management Consultancy, Business Coaching, HR Consultancy, and Business Development, fostering innovation and strategic growth.",
//                   "start": "6/1/2017",
//                   "end": "8/1/2024"
//               },
//               {
//                   "company": "Strengthening the Institutional Capacity of the Turkish Ministry of Finance, EU Funded Project ",
//                   "position": "Team Leader ",
//                   "location": "Ankara, Türkiye · On-site",
//                   "description": "- Managed the optimization of organizational structures and business processes within the Ministry of Treasury and Finance - Central Finance and Contracting Unit, resulting in enhanced operational efficiency and streamlined operations through digitization.\nLed the development and implementation of comprehensive policies, including a change management plan and training programs, to strengthen the Ministry's Human Resources and improve decision-making and strategic planning.\n- Spearheaded the creation of guidelines and performance criteria, along with the Communication and    \n- Visibility Strategy, to ensure effective project implementation, stakeholder collaboration, and enhanced organizational engagement.",
//                   "start": "11/1/2019",
//                   "end": "12/1/2023"
//               },
//               {
//                   "company": "Ministry of Finance Republic of North Macedonia ",
//                   "position": "Minister",
//                   "location": "Skopje, Skopje Statistical Region, North Macedonia · On-site",
//                   "description": "- Led the creation and implementation of national financial and economic policies, including public finance management, public debt management, and treasury management, ensuring sound fiscal governance and stability.\n- Managed the CFCD accredited body within the IPA system, overseeing tendering, contracting, and payments for EU-funded projects, and ensuring compliance with EU regulations while driving the successful implementation of multiple international finance projects.\n- Spearheaded the development of a streamlined donor support system, coordinating efforts across government bodies and enhancing the effectiveness of project programming, implementation, and reporting, including key initiatives such as World Bank projects and EU-funded programs.",
//                   "start": "6/1/2016",
//                   "end": "6/1/2017"
//               },
//               {
//                   "company_id": "103951010",
//                   "company": "PRO Public Revenue Office",
//                   "position": "Director",
//                   "location": "Skopje, Skopje Statistical Region, North Macedonia",
//                   "description": "- Led the Public Revenue Office, overseeing key functions such as tax collection, compliance risk management, tax audits, and tax arrears management, while driving the creation and implementation of effective tax policies.\n- Spearheaded the implementation of E-Government solutions to enhance business processes and institutional efficiency, including projects like the IMF FAD Modernization Program and the development of a Risk Management Software Solution.\n- Managed the execution of donor-supported projects, including EU-funded initiatives and IMF collaborations, to improve tax administration, audit functions, and client-oriented services, ensuring successful project implementation and reporting.",
//                   "start": "11/1/2015",
//                   "end": "5/1/2016"
//               },
//               {
//                   "company": "State Market Inspectorate ",
//                   "position": "Director",
//                   "location": "Skopje, Skopje Statistical Region, North Macedonia",
//                   "description": "- Managed the State Market Inspectorate, overseeing market surveillance, consumer rights protection, product safety standards, and intellectual property rights, while determining the financial, human, and technical capacities required for effective regulation enforcement.\n- Led the implementation of E-Government solutions to enhance business processes and institutional efficiency, including managing project proposals, steering committee activities, and project execution.\n- Directed the execution of EU and international projects, such as the GIZ-led initiative for improving market surveillance in the Western Balkans, and participated in Pro Safe, the European organization for market surveillance, to align with global standards and practices.",
//                   "start": "5/1/2014",
//                   "end": "10/1/2015"
//               },
//               {
//                   "company": "Council of Europe Bank/Ministry of Health/PIU",
//                   "position": "Director",
//                   "location": "Skopje, Skopje Statistical Region, North Macedonia",
//                   "description": "- Directed the management and execution of the Reconstruction and Completion of Healthcare Facilities Project, overseeing the refurbishment of 23 hospitals, including major construction projects at the Clinical Center “Mother Teresa” in Skopje and the Clinical Hospital in Stip.\n- Maintained key relationships with the Council of Europe Bank (CEB) and the Ministry of Health, ensuring the alignment of business processes and procurement procedures with CEB guidelines.\n- Managed over 100 project activities simultaneously, including the development of project programs, architectural plans, and supervision of design and construction, while preparing comprehensive monthly, quarterly, and annual reports.",
//                   "start": "11/1/2013",
//                   "end": "5/1/2014"
//               },
//               {
//                   "company": "Booz Allen Hamilton",
//                   "position": "Team Leader",
//                   "location": "Skopje, Skopje Statistical Region, North Macedonia · On-site",
//                   "description": "Macedonia Investment Development and Export Advancement Support Project/USAID:\n\n- Led the development of the organizational strategy and change management plan for InvestMacedonia, establishing export promotion programs and business processes to enhance the agency's effectiveness.\n- Managed the capacity-building initiatives for companies in key sectors (Apparel, Agriculture, Automotive, and Services), including export promotion strategies, B2B matchmaking, and participation in trade fairs and missions.\n- Spearheaded the creation of the Export Portal and CRM system for InvestMacedonia, facilitating connections between Macedonian and foreign companies, while developing a comprehensive export promotion strategy and curriculum for export education.",
//                   "start": "1/1/2010",
//                   "end": "10/1/2013"
//               },
//               {
//                   "company": "Booz Allen Hamilton",
//                   "position": "Team Leader",
//                   "location": "Skopje, Skopje Statistical Region, North Macedonia · On-site",
//                   "description": "Macedonia Business Enabling Environment Activity/USAID:\n\n- Led the implementation of the third voluntary pension pillar and capacity-building initiatives for the Macedonian Agency for Fully Funded Supervision (MAPAS), enhancing pension system oversight and sustainability.\n- Directed the development of strategies and action plans for institutional transformation, including the Macedonian Employment Service Agency and the first Macedonian private credit bureau, while providing coaching and training for effective execution.\n- Spearheaded the design and implementation of E-Government solutions, active labor market measures, and an online platform for lifelong learning, significantly improving labor market matching, vocational training, and social dialogue at national and local levels.",
//                   "start": "10/1/2006",
//                   "end": "12/1/2010"
//               },
//               {
//                   "company": "Booz Allen Hamilton",
//                   "position": "Dpt team leader /HR/Finance Manager/",
//                   "location": "Skopje, Skopje Statistical Region, North Macedonia · On-site",
//                   "description": "Macedonian Competitiveness Activity /USAID\n\n-Managed business development and grant program initiatives for SMEs, ensuring effective allocation and utilization of resources to foster growth and innovation within the sector.\n- Identified skill gaps in the SME sector and developed tailored training plans to enhance the capabilities of companies eligible for the grant program, driving overall business performance.\n- Led the Human Resources development process for both the project and SMEs, contributing to the institutional development efforts of the Ministry of Economy through comprehensive project proposals, implementation, and reporting.",
//                   "start": "10/1/2002",
//                   "end": "8/1/2006"
//               },
//               {
//                   "company": "Booz Allen Hamilton",
//                   "position": "Deputy Project Manager",
//                   "location": "Skopje, Skopje Statistical Region, North Macedonia · On-site",
//                   "description": "Macedonian Banking Project:\n\n- Led consulting activities for implementing and promoting Payment System Reforms, including the establishment of the Macedonian Deposit Insurance Fund, to enhance financial stability and protection.\n- Managed training initiatives for the National Bank of the Republic of Macedonia, focusing on banking supervision, IAS implementation, treasury operations, asset and liability management, and credit risk management within the banking sector.\n- Directed project management efforts, including the development of strategies for establishing the National Payment Card, overseeing project proposals, implementation, and reporting to ensure successful project execution.",
//                   "start": "1/1/2000",
//                   "end": "9/1/2002"
//               }
//           ],
//           "skills": [
//               {
//                   "name": "Export-Import",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Risk Management Software",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Tax Audits",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Report Preparation",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Workload Characterization",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Tax Advisory",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Policies & Procedures Development",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Labor Market",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "System Monitoring",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Private Sector Development",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Competency Management",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Process Improvement Training",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Training Coordination",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Strategy",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Business Coaching",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Consulting",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Strategic Communications",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Financial Process Improvement",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Managerial Economics",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "IT Procurement",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Sales Strategy Development",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Training and Development (HR)",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Work Process Development",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Development & Production of Publications",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Project Management",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Business Process Improvement",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Human Resource Development",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "SME sector",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Training Program Development",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Economics Education",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Training Needs Analysis",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Credit Scoring",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Managing Project Budgets",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Public Finance",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Consultation",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "E-Learning Development",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Financial Consulting",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Development & implementation of marketing plans",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "P&ID development",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Tax Compliance",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Refurbishments",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Internal Audits",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Project Planning",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Business Coordination",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Trade Missions",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Customer Relationship Management (CRM)",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Tax Assessment",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "SME management",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Second Language Acquisition",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Communication",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Change Management",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Team Building",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Performance Improvement",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Developing New Markets",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Operational Efficiency",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Streamlining Operational Processes",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Process Improvement Implementation",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Tax",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Treasury Management",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Construction Project Management",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Construction Supervision",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Business Development Consultancy",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Computer Literacy",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Post Market Surveillance",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Construction Design",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Architectural Project Management",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Training Plans",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Managerial Finance",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Organizational Development",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Budgets",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Analysis",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Training",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Management",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Recruiting",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Business Strategy",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Problem Solving",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Human Resources (HR)",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Strategic Human Resource Planning",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Critical Thinking",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Decision-Making",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "People Management",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Team Management",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Strategic Planning",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Virtual Teams",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Team Leadership",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Virtual Collaboration",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Accountability",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Business Innovation",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Lean Principles",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Lean Thinking",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Technological Innovation",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Google Analytics",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "KPI Implementation",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "KPI Reports",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Marketing Analytics",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Strategic Thinking",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Creativity Skills",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Content Marketing",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Digital Marketing",
//                   "endorsement_count": 0
//               }
//           ],
//           "languages": [],
//           "certifications": [],
//           "summary": "With over 24 years of diverse experience across both public and private sectors, including serving as the Minister of Finance, I have a strong track record of leading complex, multi-disciplinary projects funded by international organizations like the World Bank and USAID. My expertise spans from institutional capacity building and public administration reform to private sector development and digitalization of services.\n\nKey achievements include successfully managing large teams and executing critical projects in North Macedonia, Turkey, and beyond. I have led efforts in policy creation, EU funds management, and business process reengineering, contributing significantly to the transformation and modernization of public institutions. My work in harmonizing with EU standards and implementing social protection system reforms underscores my commitment to fostering sustainable development and growth.\n\nMy leadership roles as a Team Leader, Deputy Team Leader, and Project Manager across various high-impact initiatives reflect my capacity to drive results and navigate the complexities of international development and financial management."
//       },
//       "message": "Dear Dr. Kiril Minoski,\n\nYour extensive experience in public and private sectors, particularly as the former Minister of Finance, caught my attention. I'm Anna, CEO of Callbox, a specialized call center offering KPO, BPO, and calling services.\n\nGiven your expertise in international development and institutional reform, I believe our services could significantly support projects similar to those you've led with the World Bank and USAID. Our team excels in managing large-scale communication efforts, which could complement your work in policy creation and public administration reform.\n\nWith your background in digitalization of services and business process reengineering, I'd love to discuss how Callbox could assist in streamlining communication processes for international projects. Our tailored solutions could potentially enhance the efficiency of initiatives like those you've spearheaded in North Macedonia and Turkey.\n\nWould you be open to a brief call to explore how we might support your current or future endeavors in institutional capacity building and public sector development?\n\nBest regards,\nAnna\nCEO, Callbox"
//   },
//   {
//       "user": {
//           "object": "UserProfile",
//           "provider": "LINKEDIN",
//           "provider_id": "ACoAACE4nugBhvD7riInQPE7OXAguGr_lhT56U4",
//           "public_identifier": "kiril-krsteski-7487a9136",
//           "first_name": "Kiril",
//           "last_name": "Krsteski",
//           "headline": "Quality Control Team Lead at Taskforce BPO",
//           "primary_locale": {
//               "country": "US",
//               "language": "en"
//           },
//           "is_open_profile": false,
//           "is_premium": false,
//           "is_influencer": false,
//           "is_creator": false,
//           "is_relationship": false,
//           "network_distance": "SECOND_DEGREE",
//           "is_self": false,
//           "websites": [],
//           "follower_count": 206,
//           "connections_count": 206,
//           "location": "North Macedonia",
//           "birthdate": {
//               "month": 5,
//               "day": 25
//           },
//           "profile_picture_url": "https://media.licdn.com/dms/image/v2/C5603AQEGQ1uPRwZYIA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1616800352798?e=1735171200&v=beta&t=35dn7YJYUNYWepggvKfDwa541vBBWsNyvv7OWbDeJEc",
//           "background_picture_url": "https://media.licdn.com/dms/image/v2/C4D16AQFXRRQOpwmLgA/profile-displaybackgroundimage-shrink_200_800/profile-displaybackgroundimage-shrink_200_800/0/1519428194348?e=1735171200&v=beta&t=BAMM9XEtqyEHqtrPqKzHgIJ2vdwq8Qv5kA4V1xk88Hk",
//           "education": [
//               {
//                   "degree": "Bachelor of Computer Science, Computer Science",
//                   "school": "",
//                   "start": "1/1/2005",
//                   "end": "1/1/2009"
//               }
//           ],
//           "work_experience": [
//               {
//                   "company_id": "10006005",
//                   "company": "Taskforce BPO",
//                   "position": "QA/QC Specialist, General BPO",
//                   "location": "Macedonia",
//                   "description": "Taskforce BPO, headquartered in Knoxville, TN with our Global Service Office in Bitola, Macedonia, offers high-quality Business Process and Information Technology Outsourcing services at competitive prices.\n\n➨ Significantly reduce your operating costs by up to 70%\n➨ Increase your efficiency by up to 50% \n➨ Save you time and money so you can grow your business\n\nOur current partnerships include: \n📝 Insurance BPO Services: Policy Checking and Technical Assistance, \n🏥 Healthcare BPO Services: Medical Coding, Healthcare Marketing\n📈 General Business BPO Services: Multi-Industry Administration, Sales, Lead Generation and Social Media Marketing",
//                   "start": "11/1/2016",
//                   "end": null
//               }
//           ],
//           "skills": [],
//           "languages": [
//               {
//                   "name": "English",
//                   "proficiency": "Professional working proficiency"
//               },
//               {
//                   "name": "Macedonian",
//                   "proficiency": "Native or bilingual proficiency"
//               }
//           ],
//           "certifications": []
//       },
//       "message": "Hi Kiril,\n\nI noticed your role as Quality Control Team Lead at Taskforce BPO in North Macedonia. Your experience in quality control within the BPO sector caught my attention, especially given the growing importance of healthcare-related services in our industry.\n\nAt Callbox, we're seeing an increasing demand for specialized call center services in the healthcare sector. Given your background, I'm curious about the challenges you've faced in maintaining quality standards, particularly when dealing with sensitive healthcare information.\n\nWould you be open to a quick chat about how Callbox's tailored KPO and BPO solutions could potentially complement or enhance your current operations? I'd love to share some insights on how we've helped similar organizations improve their efficiency and compliance in healthcare-related projects.\n\nLooking forward to connecting and exchanging ideas.\n\nBest regards,\nAnna\nCEO, Callbox"
//   },
//   {
//       "user": {
//           "object": "UserProfile",
//           "provider": "LINKEDIN",
//           "provider_id": "ACoAAADGBL8BMCob7ua2nClUPGImKf2JfZUd_9A",
//           "public_identifier": "dzolev",
//           "first_name": "Kiril",
//           "last_name": "Djolev",
//           "headline": "Engineering Manager at RLDatix",
//           "primary_locale": {
//               "country": "US",
//               "language": "en"
//           },
//           "is_open_profile": false,
//           "is_premium": false,
//           "is_influencer": false,
//           "is_creator": true,
//           "is_relationship": false,
//           "network_distance": "SECOND_DEGREE",
//           "is_self": false,
//           "websites": [],
//           "follower_count": 1608,
//           "connections_count": 1595,
//           "location": "Skopje, Skopje Statistical Region, North Macedonia",
//           "birthdate": {
//               "month": 4,
//               "day": 26
//           },
//           "profile_picture_url": "https://media.licdn.com/dms/image/v2/C4D03AQFOoj3ATULbng/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1652704518673?e=1735171200&v=beta&t=Txt_-FOeF7BwHKclQor8vFkerAWcx2f28Vx37bAIRtI",
//           "background_picture_url": "https://media.licdn.com/dms/image/v2/C4E16AQHY2oUsSU1EEg/profile-displaybackgroundimage-shrink_200_800/profile-displaybackgroundimage-shrink_200_800/0/1517685832654?e=1735171200&v=beta&t=8wzG8epqKIXVzht5oE1a3Ku2iZ6ItFRn-7sSCESKmCo",
//           "education": [
//               {
//                   "school": "Univerzitet 'Sv. Kiril i Metódij' vo Skopje",
//                   "start": "1/1/2001",
//                   "end": "1/1/2007"
//               }
//           ],
//           "work_experience": [
//               {
//                   "company_id": "19201476",
//                   "company": "RLDatix",
//                   "position": "Engineering Manager",
//                   "description": "As an Engineering Manager, I lead a team dedicated to advancing healthcare operations technology. We focus on developing platforms that enhance operational efficiency and patient safety across healthcare organizations. Leveraging automation and data integration, our work aims to address challenges like staff shortages and care delivery issues, exacerbated by recent global events.\n\nOur solutions, built on robust data protection and privacy standards, provide actionable insights for proactive risk mitigation and efficient resource allocation. We are committed to reducing complexity and cost for healthcare providers, facilitating the adoption of innovative solutions that prioritize safety and quality.\n\nIn this role, I am proud to contribute to transformative projects that not only advance technological capabilities in healthcare but also have a meaningful impact on patient care and outcomes. Our team's efforts underscore a commitment to excellence and safety in healthcare, making a difference in the lives of millions worldwide.",
//                   "start": "4/1/2022",
//                   "end": null
//               },
//               {
//                   "company_id": "19201476",
//                   "company": "RLDatix",
//                   "position": "Engineering Lead",
//                   "description": "As the Engineering Lead at RLDatix, I'm privileged to guide a team of exceptionally talented individuals dedicated to revolutionizing healthcare operations. Our journey has been marked by the development of cutting-edge platforms that leverage technologies such as Amazon Web Services (AWS), Snowflake, and advanced Data Warehousing techniques. My role encompasses not just project oversight but fostering an environment of innovation, collaboration, and growth. I'm proud to say that our collective expertise in ELT processes and team leadership has propelled us to the forefront of healthcare technology solutions. Together, we're not just tackling current challenges; we're reimagining the future of healthcare.",
//                   "start": "3/1/2020",
//                   "end": "5/1/2022"
//               },
//               {
//                   "company_id": "19201476",
//                   "company": "RLDatix",
//                   "position": "Principal Software Engineer",
//                   "description": "As a Principal Software Engineer, I have the privilege of leading transformative projects at the intersection of Snowflake data warehousing and AWS cloud services. My role goes beyond coding; it's about architecting innovative solutions that harness the power of data to drive business intelligence and operational efficiency for our clients. I take pride in collaborating with a team of skilled professionals, each bringing their unique expertise to the table, creating a culture of learning and innovation.\n\nIn my capacity, I strategize on the integration of cutting-edge technologies, ensuring our infrastructure is robust, scalable, and secure. I'm deeply involved in the full project lifecycle, from conceptualizing data models that support complex analytics to optimizing cloud resources for performance and cost-efficiency. My work directly contributes to building a brighter future for our clients, enabling them to make data-driven decisions that propel their businesses forward.\n\nBeyond technical prowess, my role involves mentoring junior engineers, fostering a spirit of continuous improvement and encouraging a proactive approach to problem-solving. As a Principal Software Engineer, I'm committed to pushing the boundaries of what's possible, transforming challenges into opportunities for growth and innovation.",
//                   "start": "11/1/2018",
//                   "end": "3/1/2020"
//               },
//               {
//                   "company_id": "628313",
//                   "company": "Axeltra: Nearshore Software Outsourcing",
//                   "position": "Senior Software Engineer",
//                   "location": "Skopje",
//                   "start": "4/1/2017",
//                   "end": "10/1/2018"
//               },
//               {
//                   "company_id": "9046836",
//                   "company": "Jobframe GmbH",
//                   "position": "Senior Software Engineer",
//                   "location": "Mainz Area, Germany",
//                   "start": "9/1/2016",
//                   "end": "2/1/2017"
//               },
//               {
//                   "company_id": "628313",
//                   "company": "Axeltra",
//                   "position": "Development Team Lead",
//                   "location": "Macedonia",
//                   "description": "Leading a team of 5 people for developing intelligent system for calculation\nof human capital of the IT market, design for usage of HR people. Using technologies as MVC 4, KnockoutJS, XML, jQuery, ActiveReports, TFS\nLeading a team of 4 people for developing plugin for LinkedIn on Android and iPhone\nWorking on projects with different technologies as ASP.NET, Open Blue Dragon, Amazon Cloud, ColdFusion etc.",
//                   "start": "8/1/2011",
//                   "end": "8/1/2016"
//               },
//               {
//                   "company": "Freelance C# Developer",
//                   "position": "Senior Software Engineer",
//                   "description": "Developing (as a team) the first in the world most complete unattended betting engine with betting history, simulation, exotic. betting, rule designer and tester, time scheduler, bet-at-drop. Developing expert system for gathering racing data from different Australian betting agencies using web scraping and services. Developing a dashboard for presenting user calculations, rules, discussions, betting statistic etc. Technology used as Windows Forms, C#, .Net 3.5, MS SQL Server 2008, WCF, RedGate tools. MVC3, XML, LINQ, Cristal Reports etc.",
//                   "start": "6/1/2010",
//                   "end": "9/1/2011"
//               },
//               {
//                   "company_id": "624054",
//                   "company": "Matrix Global",
//                   "position": "Software engineer",
//                   "start": "8/1/2009",
//                   "end": "5/1/2010"
//               },
//               {
//                   "company_id": "277506",
//                   "company": "Ein-Sof",
//                   "position": "Software engineer",
//                   "start": "10/1/2007",
//                   "end": "8/1/2009"
//               },
//               {
//                   "company_id": "4592",
//                   "company": "SKF AB",
//                   "position": "Software engineer",
//                   "location": "Gothenburg, Sweden",
//                   "description": "Practical training at SKF AB Working with simulation of bearings.",
//                   "start": "5/1/2006",
//                   "end": "6/1/2007"
//               },
//               {
//                   "company": "CNIITU",
//                   "position": "Trainee",
//                   "location": "Belarus",
//                   "description": "Developing software for personalization of SIM Cards using C/\nC++",
//                   "start": "5/1/2003",
//                   "end": "8/1/2003"
//               }
//           ],
//           "skills": [
//               {
//                   "name": "Scrum",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Continuous Integration and Continuous Delivery (CI/CD)",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Software Development Life Cycle (SDLC)",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Engineering Management",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Team Development",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Team Motivation",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Team Organisation",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Team Coordination",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "ELT",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Team Leadership",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Team Management",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Data Warehousing",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "System Architecture",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Web Development",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Database Design",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Design Patterns",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Agile Methodologies",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Test Driven Development",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Extract, Transform, Load (ETL)",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "ASP.NET MVC",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": ".NET",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Microsoft SQL Server",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "C#",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "XML",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "jQuery",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Entity Framework",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "ASP.NET AJAX",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Databases",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "C++",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Amazon Web Services (AWS)",
//                   "endorsement_count": 2
//               },
//               {
//                   "name": "UML",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Subversion",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "T-SQL",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": ".NET Core",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "ColdFusion",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "ReSharper",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "MVC",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "SQL Server 2000-2008",
//                   "endorsement_count": 0
//               },
//               {
//                   "name": "Snowflake",
//                   "endorsement_count": 0
//               }
//           ],
//           "languages": [
//               {
//                   "name": "English",
//                   "proficiency": "Full professional proficiency"
//               },
//               {
//                   "name": "German",
//                   "proficiency": "Limited working proficiency"
//               },
//               {
//                   "name": "Macedonian",
//                   "proficiency": "Native or bilingual proficiency"
//               },
//               {
//                   "name": "Russian",
//                   "proficiency": "Limited working proficiency"
//               }
//           ],
//           "certifications": [],
//           "summary": "Throughout my career as a Software Engineer, Engineering Lead, and now Engineering Manager, I've been at the intersection of technology, driving innovation and operational excellence. My journey has been about more than coding; it's been about leading teams to develop solutions that leverage different technologies to solve real-world problems.\n\nIn each role, I've prioritized collaboration and mentorship, whether it's the application of cutting-edge technology or working on legacy products, always aiming to bring value to our customers and propel businesses forward. My focus has always been on building scalable, secure infrastructures and fostering a culture of continuous improvement. I'm proud of the impact I have made together with my colleagues on improving our customers' lives, and I'm committed to continuing to lead change in all the domains that I approach.\n\nOverall, I do magic!",
//           "hashtags": []
//       },
//       "message": "Hi Kiril,\n\nI'm Anna, CEO of Callbox. Your experience as an Engineering Manager at RLDatix caught my attention, particularly your focus on driving innovation and operational excellence in the healthcare tech space.\n\nGiven your background in leading teams to develop solutions that solve real-world problems, I thought you might be interested in how Callbox can support RLDatix's customer engagement efforts. We specialize in KPO, BPO, and call center services tailored for the healthcare industry.\n\nOur services could complement your work in building scalable, secure infrastructures by providing robust customer support and data management solutions. This could free up your team to focus more on core product development and innovation.\n\nWould you be open to a brief call to discuss how we might be able to enhance RLDatix's customer experience and operational efficiency?\n\nBest regards,\nAnna"
//   }
// ]

const formSchema = z.object({
  industry: z.string().min(1, "Industry is required"),
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
})

interface UserCardListProps {
  users: any[];
}

export function UserCardList({ users }: UserCardListProps) {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessages, setGeneratedMessages] = useState<any[]>([]);
  const [industries, setIndustries] = useState<Array<Schema["Industries"]["type"]>>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: "",
      prompt: "",
    },
  });

  useEffect(() => {
    client.models.Industries.observeQuery().subscribe({
      next: (data) => setIndustries([...data.items]),
    });
  }, []);

  const watchIndustry = form.watch("industry");
  const watchPrompt = form.watch("prompt");

  useEffect(() => {
    const selectedIndustry = industries.find(
      (i) => i.industryName === watchIndustry
    );
    if (selectedIndustry) {
      form.setValue("prompt", selectedIndustry.prompt || "");
    }
  }, [watchIndustry, form, industries]);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleGenerateMessage = async () => {
    const data = form.getValues(); 
    if (selectedUsers.size === 0 || watchPrompt.length < 20) return; 

    setIsGenerating(true);
    setGeneratedMessages([]);
    const selectedUsersList = Array.from(selectedUsers).map(id => users.find(user => user.public_identifier === id));
    
    try {
      const messages = await Promise.all(selectedUsersList.map(async (user) => {
        const response = await client.queries.generateHaiku({ 
          prompt: data.prompt,
          first_name: user.first_name,
          last_name: user.last_name,
          headline: user.headline,
          location: user.location,
          summary: user.summary,
        });
      
        if (response.errors && response.errors.length > 0) {
          throw new Error(response.errors[0].message);
        }
      
        return { user, message: response.data };
      }));

      setGeneratedMessages(messages);
      toast({
        title: "Messages generated successfully",
        description: `Generated ${messages.length} messages.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error generating messages:", error);
      toast({
        title: "Error generating messages",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
console.log(generatedMessages)
  return (
    <>
    <Separator />
    <h2 id="generated-users" className="text-2xl font-bold mb-4 mt-8">Users</h2>
    <div className="space-y-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {users.map((user) => (
          <div key={user.public_identifier} className="w-full">
            <UserCard
              user={user}
              isSelected={selectedUsers.has(user.public_identifier)}
              onSelect={() => handleSelectUser(user.public_identifier)}
            />
          </div>
        ))}
      </div>
      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Industry</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? industries.find(
                              (industry) => industry.industryName === field.value
                            )?.industryName
                          : "Select industry"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search industry..." />
                      <CommandList>
                        <CommandEmpty>No industry found.</CommandEmpty>
                        <CommandGroup>
                          {industries.map((industry) => (
                            <CommandItem
                              value={industry.industryName || ""}
                              key={industry.id}
                              onSelect={() => {
                                form.setValue("industry", industry.industryName || "");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  industry.industryName === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {industry.industryName}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Industry-specific prompt"
                    className="min-h-[250px] max-h-[30w]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="button"
            onClick={handleGenerateMessage} 
            disabled={selectedUsers.size === 0 || isGenerating || watchPrompt.length < 20}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Messages...
              </>
            ) : (
              "Generate Messages"
            )}
          </Button>
        </form>
      </Form>
      {generatedMessages.length > 0 && (
        <MessageGrid messages={generatedMessages} />
      )}
    </div>
    </>
  );
}