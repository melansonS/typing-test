const API_URL = 'http://localhost:2000';

const storageEvent = new Event('storageEvent');

export const saveResults = async (data, feedLeaderBoard) => {
  const response = await fetch(`${API_URL}/submit-result`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const json = await response.json();
  if (json.success) {
    feedLeaderBoard(data.id);
  }
};

export const getMostRecent = async (id) => {
  const response = await fetch(`${API_URL}/most-recent`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({id}),
  });
  const json = await response.json();
  console.log('most recent:', json);
  return json;
};

export const getTopThree = async () => {
  const response = await fetch(`${API_URL}/top-three`, {
    method: 'GET',
  });
  const json = await response.json();
  console.log('top three', json);
  return json;
};

export const localStoreResults = (data, diff) => {
  const udpatedData = data;
  if (diff) {
    udpatedData.diff = diff;
  }
  if (localStorage.getItem('data') === null) {
    localStorage.setItem('data', JSON.stringify([udpatedData]));
    document.dispatchEvent(storageEvent);
  } else {
    const oldData = JSON.parse(localStorage.getItem('data'));
    oldData.splice(0, 0, udpatedData);
    localStorage.setItem('data', JSON.stringify(oldData));
    document.dispatchEvent(storageEvent);
  }
};
