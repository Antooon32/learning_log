# Learning Log
Learning Log is a web-based journal system built with Python and Django. It allows users to track their learning progress by categorizing entries into specific topics, ensuring a structured approach to self-education.
> [!NOTE]
> This project originated from the base concept in **"Python Crash Course" by Eric Matthes**. While the core idea remains, it has been significantly evolved and modernized with custom features, a complete UI overhaul, and advanced Django patterns.
## Key Features
* Topic Management: Create and manage learning categories.
* Journal Entries: Add detailed logs for each topic.
* User Authentication: Secure sign-up and login system.
* Data Privacy: Restricted access - users can only view and edit their own data.
* Responsive UI: Styled using Sass for a modern look and feel.

## Tech Stack
| Layer          | Technology                                   | Status          |
|:---------------|:---------------------------------------------|:----------------|
| **Backend** | Python 3.11+, Django 5.2                     | Stable          |
| **Frontend** | Django Templates, Custom JS                | Stable         |
| **Styling** | Sass/SCSS                                    | Stable |
| **Database** | SQLite                                       | Development     |
| **Future API** | Django Rest Framework                        | Planned         |

## Project Structure
Currently, the project follows the monolithic Django architecture:
* `learning_logs/`: Core logic and models.
* `users/`: Authentication and registration.
* `static/`: Sass and JS source files.
* `templates/`: HTML structures.

## Installation & Setup
* Clone the repository:
```bash
git clone https://github.com/Antooon32/learning_log.git
cd learning_log
```
* Set up a virtual environment:
```bash
python -m venv venv
# MacOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```
* Install dependencies:
```bash
pip install -r requirements.txt
```
> **Note:** Don't forget to create a `.env` file before running the migrations!
* Database & Assets:
```bash
python manage.py migrate
python manage.py collectstatic
python manage.py compress
```
* Run the development server:
```bash
python manage.py runserver
```

## Project Evolution
- [x] Base CRUD functionality (Django + Bootstrap)
- [x] **Phase 2:** Custom Sass integration & UI Overhaul
- [ ] **Phase 3:** API development (Django Rest Framework)
- [ ] **Phase 4:** Frontend migration to React

## Contributors
* **[Antooon32](https://github.com/Antooon32)** - Core developer.
* **[Serhii Kharyponcuk](https://github.com/SerhiiKharyponcuk)** - Frontend enhancements (registration validation & loader).
