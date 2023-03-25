function phoneForPdf(phone: string) {
  if (!phone || phone.length !== 11) {
    return null;
  }

  return `+${phone.slice(0, 1)} ${phone.slice(1, 4)} ${phone.slice(4, 7)} ${phone.slice(7, 9)} ${phone.slice(9, 11)}`;
}

export { phoneForPdf };
