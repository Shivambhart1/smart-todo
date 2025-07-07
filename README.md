# 🧠 Smart Todo List with AI Integration

A full-stack intelligent task management system built with Django REST Framework (DRF) and Next.js. This app uses AI to provide smart suggestions, priority scores, and context-aware enhancements for tasks, based on daily context inputs such as notes, emails, and WhatsApp messages.

---

## 📌 Features

### ✅ Task Management
- Create, view, edit, and delete tasks.
- Filter tasks by status, category, and priority.
- Real-time deadline and priority indicators.

### 🧠 AI-Powered Enhancements
- Suggests better task descriptions.
- Recommends deadlines based on workload.
- Auto-classifies tasks into categories.
- Assigns priority scores using contextual understanding.

### 📝 Daily Context Input
- Add and store notes, messages, or emails.
- Context used for smarter task suggestions.
- Context history viewer.

---

## 🛠 Tech Stack

| Layer     | Tech                                 |
|-----------|--------------------------------------|
| Frontend  | Next.js, React, Tailwind CSS         |
| Backend   | Django REST Framework (DRF)          |
| Database  | PostgreSQL                           |
| AI Engine | OpenAI
| Storage   | Supabase Storage                     |

---

## 📷 Screenshots

- Task Dashboard
- ![image](https://github.com/user-attachments/assets/8531e2dd-e70c-4356-b3f5-a18a789a7b54)


- Context Input + AI Suggestions
- ![image](https://github.com/user-attachments/assets/1f1eda2c-4b30-4a24-8c25-eaf5299ef347)


- Priority Filter (considered range of 1 to 10 for the screenshot)
- ![image](https://github.com/user-attachments/assets/2d83ef9d-d51a-492f-95b3-8086cee837b7)
- Category Filter
- ![image](https://github.com/user-attachments/assets/3e13ed8c-bf23-4d36-b132-3fa5b0d82ac7)

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/smart-todo.git
cd smart-todo
🖥️ Frontend (Next.js + Tailwind CSS)
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
Once running, open your browser and go to:
👉 http://localhost:3000

⚙️ Backend (Django REST Framework + PostgreSQL/Supabase)
# Navigate to the backend directory
cd backend

# (Optional) Create and activate a virtual environment
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Start the backend server
python manage.py runserver
The backend will be available at:
👉 http://localhost:8000/api/
