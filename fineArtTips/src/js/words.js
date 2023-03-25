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
  menu_gallery: {
    en: "Photo Galleries",
    es: "Galerías de fotos"
  },
  menu_materials: {
    en: "Materials",
    es: "Materiales"
  },
  menu_books: {
    en: "Books",
    es: "Libros"
  },
  menu_courses: {
    en: "Courses",
    es: "Cursos"
  },
  menu_blog: {
    en: "Blog",
    es: "Blog"
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
    en: "Mailing List",
    es: "Únete a mi lista de correo"
  },
  menu_other: {
    en: "My Other Apps",
    es: "Apps"
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
    es: "Próximamente"
  },
  other_moreApps: {
    en: "More apps coming soon",
    es: "Muy pronto habrámás apps"
  },
  book_atAmazon: {
    en: "Buy this book on Amazon",
    es: "Adquiérelo en Amazon"
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
    es: "Visita mi sitio web"
  },
  fanArt_sure: {
    en: "Are you sure?",
    es: "¿Estás seguro?"
  },
  fanArt_signOut: {
    en: "Sign out",
    es: "Salir"
  },
  fanArt_signIn: {
    en: "Sign in",
    es: "Iniciar sesión"
  },
  fanArt_signUp: {
    en: "Sign up",
    es: "Regístrate"
  },
  fanArt_change_userpic: {
    en: "Change profile picture",
    es: "Cambiar foto de perfil"
  },
  fanArt_from_gallery: {
    en: "From Gallery",
    es: "De la galería"
  },
  fanArt_from_camera: {
    en: "From Camera",
    es: "Desde la cámara"
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
  fanArt_my_uploads: {
    en: "My Uploads",
    es: "Mis fotos"
  },
  fanArt_all_uploads: {
    en: "All Uploads",
    es: "Todas las fotos"
  },
  fanArt_best_of_week: {
    en: "Most Liked: Last 30 Days",
    es: "Más gustados: Últimos 30 días"
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
    en: "Upgrade to gain off-line access to all the photos",
    es: `Para ver todas las imágenes sin conexión, adquiere la versión “Premium”`
  },
  upgradeMessageVip: {
    en: "Upgrade to gain access to the VIP Member videos",
    es: "Desbloquea los videos de la Zona VIP y elimina los anuncios"
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
    en: "Check out other apps by Leonardo",
    es: "Baja las otras apps de Leonardo"
  },
  checkOtherAppsDevs: {
    en: "developed by allmax team",
    es: "developed by allmax team"
  },
  checkOtherAppsDevsSite: {
    en: "www.allmax.team",
    es: "www.allmax.team"
  },
  chechoutEBook: {
    en: "Also checkout my ebooks",
    es: "Mis ebooks"
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
  title: {
    en: "Title",
    es: "Título"
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
    en: "Subscribe to recive news and discounts to my new courses, books and events",
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
    es: "Suscríbete"
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
    es: "Error en la dirección de email"
  },
  forgotPassword: {
    en: "Forgot password?",
    es: "¿Olvidaste la contraseña?"
  },
  recoveryPassword: {
    en: "Recovery password",
    es: "Recuperar contraseña"
  },
  youCanRecover: {
    en: "You can recover your password",
    es: "Puedes recuperar tu contraseña"
  },
  checkYourEmail: {
    en: "Check your email",
    es: "Revisa tu email"
  },
  logoURL: {
    en: "img/fineart-tips-logo-small.png",
    es: "img/arte-devierte-logo.png"
  },
  upload_image: {
    en: "Upload image",
    es: "Cargar imagen"
  },
  yt_sub: {
    en: "YouTube Subscribe",
    es: "Suscríbete en YouTube"
  },
  by_Leo: {
    en: "by Leonardo Pereznieto",
    es: "por Leonardo Pereznieto"
  },
  read_more: {
    en: "Read more",
    es: "Leer más"
  },
  hide: {
    en: "Hide",
    es: "Esconder"
  }
};
