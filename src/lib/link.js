// linkGenerator function : function yang digunakan untuk membuat link berdasarkan env variable dari NODE_ENV
const linkGenerator = (data) => {
  const host =
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_HOST
      : process.env.DEVELOPMENT_HOST;
  return `${host}/verification/${data}`;
};

module.exports = { linkGenerator };
