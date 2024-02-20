INSTALLATION AND CONFIGURATION
1. Ensure python is running on your machine. You can download and install directly from https://www.python.org/ . This will enable one run pip commands
2. Open the project as a folder and run the pip command " pip install -r requirements.txt " to install all dependencies inside of the requirements.txt folder which is needed for the project.
3. Once successfully installed and your terminal on vs code or pycharm points the folder where manage.py is, run the command " python manage.py runserver " to run the server at http://127.0.0.1:8000/
4. You can open http://127.0.0.1:8000/ on your web page to view

LIBRARIES AND DEPENDENCIES
1. The needed libraries are available in the requirements.txt folder which can be installed individually using pip install 'library name' or install all libraries at once using " pip install -r requirements.txt "

CODE ORGANIZATION - main
1. urls.py - Where all the url routings are
2. views.py - Where all logics are
3. settings.py - where installed apps are
4. templatetags/translations - where translations folder is
5. models.py - where the database table is organised
6. templates/base - where all the templates are pointed to and available
7. The other folders are pre formed by django and may not need any modifications for this project



