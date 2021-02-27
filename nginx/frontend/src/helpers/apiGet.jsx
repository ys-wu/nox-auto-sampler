export default function get(url, processor=f=>f, errorHandler=console.error) {
  const d = new Date();
  fetch(url)
    .then(res => res.json())
    .then(processor)
    .then((res) => console.log(d.toISOString(), 'Get data from API:', res))
    .catch(errorHandler);
};
