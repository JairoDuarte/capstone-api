export const success = (res, entity, status) => {
    if (entity) {
      return res.status(status || 200).json(entity);
    }
    return null;
  }
  
export const notFound = (res, entity) => {
    if (!entity) {
        return res.status(404).end();
    }
}
  