const userFormat: Record<string, string> = {
  ad: 'DD/MM/YYYY, h:mm a - ',
  yh: 'ja',
};

function useFormat() {
  const query = new URLSearchParams(window.location.search);
  const name = query.get('name');
  if (!name) return null;
  return userFormat[name];
}

export default useFormat;