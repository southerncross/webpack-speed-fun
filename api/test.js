module.exports = (req, res) => {
  const data = { hoho: Math.random() };
  res.status(200).send(data);
};
