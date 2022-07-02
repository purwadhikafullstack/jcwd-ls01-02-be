// linkGenerator function : function yang digunakan untuk membuat link berdasarkan env variable dari NODE_ENV
const linkGenerator = (data, type) => {
  const host =
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_HOST
      : process.env.DEVELOPMENT_HOST;
  const path = type ? "verification" : "reset-password";
  return `${host}/${path}/verification/${data}`;
};

module.exports = { linkGenerator };
