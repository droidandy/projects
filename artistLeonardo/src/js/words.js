/**
 * Created by developercomputer on 03.12.15.
 */
module.exports = {
  init(ln) {
    var moment = require("moment");
    moment.locale(ln); //setting moment's locale
    window.LN = ln; //global variable to define language
  },
  back: {
    en: "Back",
    es: "Volver"
  },
  close: {
    en: "Close",
    es: "Cerrar"
  },
  cancel: {
    en: "Cancel",
    es: "Cancelar"
  },
  menu_video: {
    en: "Video Tutorials",
    es: "Videos tutoriales"
  },
  menu_contact: {
    en: "Contact",
    es: "Contacto"
  },
  menu_gallery: {
    en: "Gallery",
    es: "Galería"
  },
  menu_books: {
    en: "Books & Courses",
    es: "Libros y cursos"
  },
  menu_courses: {
    en: "Courses",
    es: "Cursos"
  },
  menu_blog: {
    en: "Blog",
    es: "Blog"
  },
  menu_materials: {
    en: "Materials",
    es: "Materiales"
  },
  menu_fanart: {
    en: "Fan Art",
    es: "Fan Art"
  },
  menu_leo: {
    en: "Leonardo Pereznieto",
    es: "Leonardo Pereznieto"
  },
  menu_subscribe: {
    en: "Subscribe to Newsletter",
    es: "Suscríbete a mi carta informativa"
  },
  menu_other: {
    en: "My Other Apps",
    es: "Mis otras apps"
  },
  menu_vip: {
    en: "VIP Zone",
    es: "Área VIP"
  },
  blog_read: {
    en: "Read more",
    es: "Leer más"
  },
  other_noApps: {
    en: "There are no other applications yet.",
    es: "Aun no hay otras aplicaciones"
  },
  other_soon: {
    en: "Coming soon!",
    es: "¡Pronto las habrá!"
  },
  other_moreApps: {
    en: "More apps coming soon",
    es: "Muy pronto habrámás apps"
  },
  book_atAmazon: {
    en: "Buy this book on Amazon",
    es: "Adquiere este libro en Amazon"
  },
  book_buy: {
    en: "Buy",
    es: "Comprar"
  },
  courses_take: {
    en: "Take this course",
    es: "Toma este curso"
  },
  about_visit: {
    en: "Visit my website",
    es: "Para mayor información visita su sitio"
  },
  upload_image: {
    en: "Upload image",
    es: "Cargar imagen"
  },
  fanArt_sure: {
    en: "Are you sure?",
    es: "¿Estás seguro?"
  },
  fanArt_signOut: {
    en: "Sign out",
    es: "Cerrar sesión"
  },
  fanArt_signIn: {
    en: "Sign in",
    es: "Iniciar sesión"
  },
  fanArt_signUp: {
    en: "Sign up",
    es: "Regístrate"
  },
  fanArt_username: {
    en: "Username",
    es: "Nombre de usuario"
  },
  fanArt_firstName: {
    en: "First name",
    es: "Nombre"
  },
  fanArt_lastName: {
    en: "Last name",
    es: "Apellido"
  },
  fanArt_password: {
    en: "Password",
    es: "Palabra clave"
  },
  fanArt_choosePhoto: {
    en: "Choose your photo",
    es: "Elige tu foto"
  },
  fanArt_post: {
    en: "Post",
    es: "Publicar"
  },
  fanArt_canPostMsg: {
    en: "You can post comments if you sign in.",
    es: "Si inicias una sesión podrás publicar tus comentarios"
  },
  fanArt_placeholder: {
    en: "Post your comment here",
    es: "Publica tu comentario aquí"
  },
  fanArt_noComments: {
    en: "No comments to display",
    es: "No hay comentarios que mostrar"
  },
  fanArt_chooseReason: {
    en: "Choose a reason",
    es: "Elige una razón"
  },
  fanArt_report_1: {
    en: "This account might be compromised or hacked",
    es: `Esta cuenta puede haber sido comprometida o "hackeada"`
  },
  fanArt_report_2: {
    en: "Violence or harmful content",
    es: "Contenido de violencia o destructivo"
  },
  fanArt_report_3: {
    en: "Sexually explicit content",
    es: "Contenido sexualmente explícito"
  },
  fanArt_report_4: {
    en: "Another violation of the guidelines",
    es: "Otra violación de las reglas"
  },
  fanArt_reportLabel: {
    en: "Report",
    es: "Informe"
  },
  warning: {
    en: "Warning",
    es: "¡Atención!"
  },
  someGoesWrong: {
    en: "Something went wrong",
    es: "Algo salió mal"
  },
  errorOccurred: {
    en: "Some error occurred",
    es: "Hubo un error"
  },
  emptyFieldsErr: {
    en: "Some fields are empty",
    es: "Algunos espacios están vacíos"
  },
  passwordLoginErr: {
    en: "Password or login is wrong",
    es: "Usuario o contraseña incorrecta"
  },
  weakPassErr: {
    en: "Password is too weak",
    es: "La palabra clave es demasiado débil"
  },
  more6msg: {
    en: "Enter more then 6 symbols",
    es: "Usa más de 6 caracteres"
  },
  welcome: {
    en: "Welcome",
    es: "Bienvenido"
  },
  successLoginMsg: {
    en: "Now you can upload your works",
    es: "¡Ahora puedes subir tus trabajos!"
  },
  nameTakenMsg: {
    en: word => `Username ${word} already taken`,
    es: word => `El nombre de usuario ${word} ya ha sido usado`
  },
  upgradeMessageGallery: {
    en: "Upgrade togain off-line access to all the photos",
    es: "Adquiere la versión completa para tener acceso a todas las fotos, sin conexión"
  },
  upgradeMessageVip: {
    en: "Upgrade to gain access to the VIP Member videos",
    es: "Desbloquea los videos delaZona VIP y elimina los anuncios"
  },
  share: {
    en: "Share",
    es: "Compartir"
  },
  viewOnAppStore: {
    en: "View on the App Store",
    es: "Encuéntrala en la App Store"
  },
  viewOnGooglePlay: {
    en: "View on the Google Play",
    es: "Encuéntrala en la Google Play"
  },
  checkOtherApps: {
    en: "Checkout other apps by Leonardo",
    es: "Checa las otras apps de Leonardo"
  },
  vipMemberVideo: {
    en: "VIP Member videos",
    es: "Videos para los Miembros VIP"
  },
  weeklyVideoDownload: {
    en: "Weekly Video Download",
    es: "Descarga del video semanal"
  },
  description: {
    en: "Description",
    es: "Descripción"
  },
  langs: {
    en: "Languages",
    es: "Idiomas"
  },
  repeatPass: {
    en: "Repeat password",
    es: "Repite la palabra clave"
  },
  passwordsDismatch: {
    en: "Passwords do not match",
    es: "Las palabras clave no coinciden"
  },
  joinMyEmail: {
    en: "Join my e-mail list",
    es: "Suscríbete a mi lista de correo"
  },
  subscribeText: {
    en: "Subscribe to recive new and discounts to my new courses, books and events",
    es: "Deja tu dirección de email para recibir noticias y descuentos en los nuevos cursos de Leonardo."
  },
  sub_email_placeholder: {
    en: "Type your e-mail here...",
    es: "Email"
  },
  sub_name_placeholder: {
    en: "...and Your first name here",
    es: "Nombre"
  },
  subscribe: {
    en: "Subscribe",
    es: "Subskrybe"
  },
  success: {
    en: "Success",
    es: "Ha sido exitoso"
  },
  success_sub_msg: {
    en: "All fine! Now you are subscribed!",
    es: "¡Bien! Ahora estás suscrito"
  },
  email: {
    en: "Email",
    es: "Email"
  },
  wrongEmailMsg: {
    en: "Wrong email!",
    es: "Wrong email!"
  },
  forgotPassword: {
    en: "Forgot password?",
    es: "¿Olvidaste la contraseña?"
  },
  recoveryPassword: {
    en: "Recovery password",
    es: "Recovery password"
  },
  youCanRecover: {
    en: "You can recover your password",
    es: "You can recover your password"
  },
  checkYourEmail: {
    en: "Check your email",
    es: "Check your email"
  },
  media: {
    en: "Media",
    es: "Medios"
  },
  contact_head: {
    en: `For availability and pricing of artworks, or for information about commissions and workshops by Leonardo, please contact us.`,
    es: `Para obtener el precio y disponibilidad de las obras, o para información acerca de contrataciones para encargos o talleres, por favor escríbenos.`
  },
  contact_head_mark: {
    en: `(Business only, no personal messages, please)`,
    es: `(Favor de no enviar mensajes personales, sólo asuntos de negocios, gracias.)`
  },
  contact_head_email: {
    en: `info@leonardopereznieto.com`,
    es: `info@leonardopereznieto.com`
  },
  contact_placeholder1: {
    en: "Enter your name here",
    es: "Nombre"
  },
  contact_placeholder2: {
    en: "Your email",
    es: "Email"
  },
  contact_placeholder3: {
    en: "Subject",
    es: "Asunto"
  },
  contact_placeholder4: {
    en: "Message",
    es: "Mensaje"
  },
  contact_submit: {
    en: "Send",
    es: "Enviar"
  },
  subscribe_head_text: {
    en: `Leave your information to receive images of newly created artworks and news from Leonardo Pereznieto`,
    es: `Suscríbete para recibir imágenes de las nuevas obras y noticias de Leonardo Pereznieto.`
  },
  subscribe_list1: {
    en: "Art Collectors",
    es: "Art Collectors"
  },
  subscribe_list2: {
    en: "Art instruction",
    es: "Art instruction"
  },
  list: {
    en: "List",
    es: "List"
  },
  lang: {
    en: "English",
    es: "Espanol"
  },
  adultWarning: {
    en: "This app contains mild artistic nudity.",
    es: "Esta aplicación contiene desnudos artísticos"
  },
  leaveApp: {
    en: "Leave app",
    es: "Salir de la app"
  },
  continue: {
    en: "Continue",
    es: "Acepto"
  },
  getAccess: {
    en: "Get access",
    es: "Tener acceso"
  },
  to: {
    en: "to",
    es: "a"
  },
  read_more: {
    en: "Read more",
    es: "Leer más"
  },
  hide: {
    en: "Hide",
    es: "Esconder"
  },
  message_sent: {
    en: "Message sent",
    es: "Mensaje enviado"
  }
};
