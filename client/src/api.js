const API_URL = 'http://localhost:2000';

const storageEvent = new Event('storageEvent');

export const saveResults = async (data, setMostRecent, setTopThree) => {
  const response = await fetch(`${API_URL}/submit-result`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const json = await response.json();
  if (json.success) {
    setMostRecent(json.mostRecent);
    setTopThree(json.topThree);
  }
};

export const updateName = async (resultsId) => {
  const name = prompt('What is your name?');
  const data = { id: resultsId, name };
  const response = await fetch(`${API_URL}/add-name`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  });
  const json = await response.json();
  console.log(json);
};

export const getMostRecent = async () => {
  const response = await fetch(`${API_URL}/most-recent`, {
    method: 'GET',
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
  console.log('diff?', diff);
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
