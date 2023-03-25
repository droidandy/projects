function validateFullAddress(obj: any) {
  return obj?.value?.data && obj.value.data.house;
}

export { validateFullAddress };
