![Image](https://github.com/user-attachments/assets/44486ce8-e9a3-4483-a77d-8281f5a91755)
### Project overview
Haivy was created to provide patients with an accessible, friendly and intuitive platform to aid them on their journey to curing their disease. 

The platform also enrichen communication between patients and the healthcare service provider, providing both parties with useful feedback and progress tracking. This enhances the treatment process and gives users a richer environment to treat this disease.

The name of the project is based on pronunciation of the word `HIV` (`ech ai vee`) - `Haivy`. 
### Main Features
- Appointment & Scheduling system: The application allows customers to book appointments with the healthcare provider, both anonymously and with a registered account. Healthcare providers are able to verify the customer's identity through phone call and confirm with associated parties for the approval of the appointment.
- Medicine tracking system: The system allows users to mark whether or not they have taken the pill associated with a time slot (Morning, Noon, Afternoon, Night) and track their progress for the prescribed amount of medication. The system will also provide push notification through the mobile application before the associated time slot. Doctors will also be able to see patient's progress and take actions accordingly. When prescribing medicine to the patient, doctors can also customize the regimen retrieved from the regimen data on the platform to provide a customized prescription for the patient. Users of the system will also be able to view the medicine detailed information, its effects and side effects, etc.
- Tests' Result: The healthcare provider also provide testing services on-demand or by doctor's request for a patient. Registered patients will be able to see their testing history and get result's analysis and reporting.
### Tech Stack
1. Frontend: The frontend is built with React through the Vite compiler and uses DaisyUI as the main UI Library, and Tailwind provides tooling.
- Framework: React (Vite)
- UI Library: DaisyUI
- Tooling: Tailwind
- Backend Service Consumption: The Supabase JavaScript SDK
3. Backend: The project is based around [Supabase](https://supabase.com/) - an **open source**, **fast** and **reliable** BaaS (Backend as a Service) service provider. 
- Data processing: Supabase Edge Functions (Deno)
- SQL Database: Supabase Database (PostgreSQL)
- Authentication: Supabase Auth
- Data Storage: Supabase Storage
4. Third-party providers
- Twilio: SMS Messaging Services
- Momo: Payment Service Provider (TBD)
