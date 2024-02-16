from django import template
register = template.Library()
from pracs.models import User

translations = [
    {"id": "Welcome Back", "en": "Welcome Back", "esp": "Bienvenido de nuevo", "it": "Benvenuto di nuovo", "fr": "Bienvenue de retour", "de": "Willkommen zurück"},
    {"id": "Back", "en": "Back", "esp": "Volver", "it": "Indietro", "fr": "Retour","de": "Zurück"},
    {"id": "Remember me", "en": "Remember me", "esp": "Recuérdame", "it": "Ricordami", "fr": "Souviens-toi de moi", "de": "Erinnere dich an mich"},
    {"id": "Forgot Password", "en": "Forgot Password", "esp": "¿Olvidó su contraseña?", "it": "Ha dimenticato la password", "fr": "Mot de passe oublié", "de": "Passwort vergessen"},
    {"id": "Sign in", "en": "Sign in", "esp": "Iniciar sesión", "it": "Accedi", "fr": "Se connecter","de": "Anmelden"},
    {"id": "Don't have an account yet?", "en": "Don't have an account yet?", "esp": "¿Aún no tienes una cuenta?", "it": "Non hai ancora un account?", "fr": "Vous n'avez pas encore de compte?", "de": "Noch kein Konto?"},
    {"id": "Sign up", "en": "Sign up", "esp": "Regístrate", "it": "Iscriviti", "fr": "S'inscrire", "pt": "Inscrever-se", "de": "Registrieren"},
    {"id": "What is your language", "en": "What is your language", "esp": "¿Cuál es tu idioma?", "it": "Qual è la tua lingua", "fr": "Quelle est votre langue", "de": "Was ist deine Sprache"},
    {"id": "Select a language to get started", "en": "Select a language to get started", "esp": "Selecciona un idioma para comenzar", "it": "Seleziona una lingua per iniziare", "fr": "Sélectionnez une langue pour commencer", "de": "Wähle eine Sprache, um zu beginnen"},
    {"id": "Continue", "en": "Continue", "esp": "Continuar", "it": "Continua", "fr": "Continuer", "de": "Weiter"},
    {"id": "Previous", "en": "Previous", "esp": "Anterior", "it": "Precedente", "fr": "Précédent",  "de": "Vorherige"},
    {"id": "Get Started by entering your lightning address", "en": "Get Started by entering your lightning address", "esp": "Comienza ingresando tu dirección de lightning", "it": "Inizia inserendo il tuo indirizzo lightning", "fr": "Commencez par saisir votre adresse Lightning", "de": "Starte, indem du deine Lightning-Adresse eingibst"},
    {"id": "Lightning address", "en": "Lightning address", "esp": "Dirección de lightning", "it": "Indirizzo lightning", "fr": "Adresse Lightning", "de": "Lightning-Adresse"},
    {"id": "Password", "en": "Password", "esp": "Contraseña", "it": "Password", "fr": "Mot de passe", "pt": "Senha", "de": "Passwort"},
    {"id": "Confirm Password", "en": "Confirm Password", "esp": "Confirmar contraseña", "it": "Conferma password", "fr": "Confirmer le mot de passe", "de": "Passwort bestätigen"},
    {"id": "Already have an account?", "en": "Already have an account?", "esp": "¿Ya tienes una cuenta?", "it": "Hai già un account?", "fr": "Vous avez déjà un compte?", "de": "Bereits ein Konto?"},
    {"id": "Log in", "en": "Log in", "esp": "Iniciar sesión", "it": "Accedi", "fr": "Se connecter", "de": "Anmelden"},
    {"id": "Profile", "en": "Profile", "esp": "Perfil", "it": "Profilo", "fr": "Profil", "de": "Profil"},
    {"id": "Leaderboard", "en": "Leaderboard", "esp": "Tabla de clasificación", "it": "Classifica", "fr": "Classement", "de": "Bestenliste"},
    {"id": "Nick name", "en": "Nickname", "esp": "Apodo", "it": "Soprannome", "fr": "Pseudo", "pt": "Apelido", "de": "Spitzname"},
    {"id": "Language", "en": "Language", "esp": "Idioma", "it": "Lingua", "fr": "Langue", "de": "Sprache"},
    {"id": "Log out", "en": "Log out", "esp": "Cerrar sesión", "it": "Esci", "fr": "Déconnexion", "de": "Abmelden"},
    {"id": "Change Avatar", "en": "Change Avatar", "esp": "Cambiar avatar", "it": "Cambia avatar", "fr": "Changer d'avatar", "de": "Avatar ändern"},
    {"id": "Update Profile", "en": "Update Profile", "esp": "Actualizar perfil", "it": "Aggiorna il profilo", "fr": "Mettre à jour le profil", "de": "Profil aktualisieren"},

    {"id": "Email address", "en": "Email address", "esp": "Dirección de correo electrónico", "fr": "Adresse e-mail", "it": "Indirizzo email", "de": "E-Mail-Adresse"},
    {"id": "Password confirmation", "en": "Password confirmation", "esp": "Confirmación de contraseña", "fr": "Confirmation du mot de passe", "it": "Conferma password", "de": "Passwort-Bestätigung"},
    {"id": "en", "en": "English", "esp": "Inglés", "fr": "Anglais", "it": "Inglese", "de": "Englisch"},
    {"id": "esp", "en": "Spanish", "esp": "Español", "fr": "Espagnol", "it": "Spagnolo", "de": "Spanisch"},
    {"id": "fr", "en": "French", "esp": "Francés", "fr": "Français", "it": "Francese", "de": "Französisch"},
    {"id": "it", "en": "Italian", "esp": "Italiano", "fr": "Italien", "it": "Italiano", "de": "Italienisch"},
    {"id": "Pidgin English", "en": "Pidgin English", "esp": "Inglés pidgin", "fr": "Anglais pidgin", "it": "Inglese pidgin", "de": "Pidgin-Englisch"},
    {"id": "de", "en": "German", "esp": "Alemán", "fr": "Allemand", "it": "Tedesco", "de": "Deutsch", "pt": "Alemão"},
    {"id": "The Solution", "en": "The Solution", "esp": "La solución", "fr": "La solution", "it": "La soluzione", "de": "Die Lösung"},
    {"id": "Get started", "en": "Get started", "esp": "Comenzar", "fr": "Commencer", "it": "Inizia", "de": "Los geht's", "pt": "Comece"},
    {"id": "Already have an account", "en": "Already have an account", "esp": "Ya tengo una cuenta", "fr": "J'ai déjà un compte", "it": "Hai già un account", "de": "Bereits ein Konto haben"},
    {"id": "Log in", "en": "Log in", "esp": "Iniciar sesión", "fr": "Se connecter", "it": "Accedi", "de": "Anmelden"},
    {"id": "Username", "en": "Username", "esp": "Nombre de usuario", "fr": "Nom d'utilisateur", "it": "Nome utente", "de": "Benutzername"},

    {"id": "Password reset", "en": "Password reset", "esp": "Restablecimiento de contraseña",
     "fr": "Réinitialisation du mot de passe", "it": "Ripristino password", "de": "Passwort zurücksetzen"},

{
 "id": "Select an Avatar",
  "en": "Select an Avatar",
  "fr": "Sélectionner un Avatar",
  "esp": "Seleccionar un Avatar",
  "it": "Seleziona un Avatar",
  "de": "Wähle einen Avatar"
},

{
'id': 'Earn sats',
    'en': 'Earn SATS',
    'fr': 'Gagner des sats',
    'it': 'Guadagna sats',
    'de': 'Sats verdienen',
    'esp': 'Ganar sats'
},
{
'id': 'Confirm',
    'en': 'Confirm',
    'fr': 'Confirmer',
    'it': 'Conferma',
    'de': 'Bestätigen',
    'esp': 'Confirmar'
},


{
    'id': 'What is your',
    'en': 'What is your',
    'esp': '¿Cuál es tu',
    'it': 'Qual è il tuo',
    'de': 'Was ist dein',
    'fr': 'Quel est ton'
},
{
    'id': 'This is what other community members see',
    'en': 'This is what other community members see.',
    'esp': 'Esto es lo que ven otros miembros de la comunidad.',
    'it': 'Questo è ciò che vedono gli altri membri della comunità.',
    'de': 'Das ist, was andere Community-Mitglieder sehen.',
    'fr': 'Ceci est ce que voient les autres membres de la communauté.'
},
{
    'id': 'Ordinals',
    'en': 'Ordinals',
    'esp': 'Ordinales',
    'it': 'Ordinali',
    'de': 'Ordinalzahlen',
    'fr': 'Ordinaux'
},
{
    'id': 'Edit profile',
    'en': 'Edit Profile',
    'esp': 'Editar perfil',
    'it': 'Modifica profilo',
    'de': 'Profil bearbeiten',
    'fr': 'Modifier le profil'
},

    {
        "id": "Forgotten your password? Enter your email address below, and we will email instructions for setting a new one.",
        "en": "Forgotten your password? Enter your email address below, and we'll email instructions for setting a new one.",
        "esp": "¿Olvidaste tu contraseña? Ingresa tu dirección de correo electrónico a continuación y te enviaremos instrucciones para establecer una nueva.",
        "fr": "Vous avez oublié votre mot de passe ? Entrez votre adresse e-mail ci-dessous, et nous vous enverrons des instructions pour en définir un nouveau.",
        "it": "Hai dimenticato la tua password? Inserisci il tuo indirizzo email qui sotto e ti invieremo istruzioni per impostarne una nuova.",
        "de": "Haben Sie Ihr Passwort vergessen? Geben Sie unten Ihre E-Mail-Adresse ein, und wir senden Ihnen Anweisungen zum Festlegen eines neuen Passworts."},

        {"id": "Password reset sent", "en": "Password reset sent", "esp": "Restablecimiento de contraseña enviado",
         "fr": "Réinitialisation du mot de passe envoyée", "it": "Ripristino password inviato",
         "de": "Passwort zurücksetzen gesendet"},

        {
        "id": "We've emailed you instructions for setting your password, if an account exists with the email you entered. You should receive them shortly.",
        "en": "We've emailed you instructions for setting your password, if an account exists with the email you entered. You should receive them shortly.",
        "esp": "Te hemos enviado instrucciones por correo electrónico para establecer tu contraseña, si existe una cuenta con el correo electrónico que ingresaste. Deberías recibirlos pronto.",
        "fr": "Nous vous avons envoyé des instructions par e-mail pour définir votre mot de passe, si un compte existe avec l'adresse e-mail que vous avez saisie. Vous devriez les recevoir bientôt.",
        "it": "Abbiamo inviato istruzioni via email per impostare la tua password, se esiste un account con l'indirizzo email che hai inserito. Dovresti riceverle a breve.",
        "de": "Wir haben Ihnen Anweisungen per E-Mail gesendet, um Ihr Passwort festzulegen, falls ein Konto mit der von Ihnen eingegebenen E-Mail-Adresse existiert. Sie sollten sie bald erhalten.",},

    {
        "id": "If you don't receive an email, please make sure you've entered the address you registered with, and check your spam folder.",
        "en": "If you don't receive an email, please make sure you've entered the address you registered with, and check your spam folder.",
        "esp": "Si no recibes un correo electrónico, asegúrate de haber ingresado la dirección con la que te registraste y revisa tu carpeta de correo no deseado.",
        "fr": "Si vous ne recevez pas d'e-mail, assurez-vous d'avoir saisi l'adresse avec laquelle vous vous êtes inscrit, et vérifiez votre dossier de courrier indésirable.",
        "it": "Se non ricevi un'email, assicurati di aver inserito l'indirizzo con cui ti sei registrato e controlla la cartella dello spam.",
        "de": "Wenn Sie keine E-Mail erhalten, stellen Sie sicher, dass Sie die Adresse eingegeben haben, mit der Sie sich registriert haben, und überprüfen Sie Ihren Spam-Ordner."},

        {"id": "Enter new password", "en": "Enter new password", "esp": "Ingresar nueva contraseña",
         "fr": "Entrer un nouveau mot de passe", "it": "Inserisci una nuova password", "de": "Neues Passwort eingeben"},

        {"id": "Please enter your new password twice.", "en": "Please enter your new password twice.",
         "esp": "Por favor, ingresa tu nueva contraseña dos veces.",
         "fr": "Veuillez saisir votre nouveau mot de passe deux fois.", "it": "Inserisci la tua nuova password due volte.",
         "de": "Bitte geben Sie Ihr neues Passwort zweimal ein."},

        {"id": "Update password", "en": "Update password", "esp": "Actualizar contraseña",
         "fr": "Mettre à jour le mot de passe", "it": "Aggiorna password", "de": "Passwort aktualisieren"},

        {"id": "Password reset complete", "en": "Password reset complete", "esp": "Restablecimiento de contraseña completo",
         "fr": "Réinitialisation du mot de passe terminée", "it": "Ripristino password completato",
         "de": "Passwort zurücksetzen abgeschlossen"},

        {"id": "Your password has been set. You may go ahead and log in now.",
         "en": "Your password has been set. You may go ahead and log in now.",
         "esp": "Tu contraseña ha sido establecida. Puedes continuar e iniciar sesión ahora.",
         "fr": "Votre mot de passe a été défini. Vous pouvez aller de l'avant et vous connecter maintenant.",
         "it": "La tua password è stata impostata. Puoi procedere e accedere ora.",
         "de": "Ihr Passwort wurde festgelegt. Sie können jetzt fortfahren und sich anmelden."},

        {"id": "New password", "en": "New password", "esp": "Nueva contraseña", "fr": "Nouveau mot de passe",
         "it": "Nuova password", "de": "Neues Passwort"},

        {"id": "New password confirmation", "en": "New password confirmation", "esp": "Confirmación de nueva contraseña",
         "fr": "Confirmation du nouveau mot de passe", "it": "Conferma nuova password",
         "de": "Bestätigung des neuen Passworts"},
    {"id": "Your password can't be too similar to your other personal information.",
     "en": "Your password can't be too similar to your other personal information.",
     "es": "Tu contraseña no puede ser demasiado similar a tu otra información personal.",
     "fr": "Votre mot de passe ne peut pas être trop similaire à vos autres informations personnelles.",
     "it": "La tua password non può essere troppo simile alle tue altre informazioni personali.",
     "de": "Ihr Passwort darf nicht zu ähnlich zu Ihren anderen persönlichen Informationen sein."},

    {"id": "Your password must contain at least 8 characters.",
     "en": "Your password must contain at least 8 characters.",
     "es": "Tu contraseña debe contener al menos 8 caracteres.",
     "fr": "Votre mot de passe doit contenir au moins 8 caractères.",
     "it": "La tua password deve contenere almeno 8 caratteri.",
     "de": "Ihr Passwort muss mindestens 8 Zeichen enthalten."},

    {"id": "Your password can't be a commonly used password.", "en": "Your password can't be a commonly used password.",
     "es": "Tu contraseña no puede ser una contraseña comúnmente utilizada.",
     "fr": "Votre mot de passe ne peut pas être une mot de passe couramment utilisé.",
     "it": "La tua password non può essere una password comunemente utilizzata.",
     "de": "Ihr Passwort darf nicht eine häufig verwendete Passwort sein."},

    {"id": "Your password can't be entirely numeric.", "en": "Your password can't be entirely numeric.",
     "es": "Tu contraseña no puede ser totalmente numérica.",
     "fr": "Votre mot de passe ne peut pas être entièrement numérique.",
     "it": "La tua password non può essere interamente numerica.",
     "de": "Ihr Passwort darf nicht vollständig numerisch sein."}

]

@register.filter(name='translate')
def translate(id_value, id):
    try:
        user = User.objects.get(id=id)
        user_language = user.language.lower()
        translation = next((d[user_language] for d in translations if d["id"] == id_value), None)
        emerge = id_value
        return translation if translation else emerge
    except User.DoesNotExist:
        emerge = id_value
        return emerge

@register.filter(name='new_translate')
def new_translate(id_value, la):
    translation = next((d[la] for d in translations if d["id"] == id_value), None)
    emerge = id_value
    return translation if translation else emerge



