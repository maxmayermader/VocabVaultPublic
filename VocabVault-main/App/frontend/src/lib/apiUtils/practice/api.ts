// app/api/practice/page.ts
// "use server";
export async function fetchUserCardSet(setId: string) {
    console.log("skibidi id", setId);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards/user-card-set/${setId}`
    );
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    return res.json();
}

export async function fetchCard(cardId: string, username: any) {
  console.log("cardId", cardId);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards/card-with-progress/${cardId}/${username}`);

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export async function updateProgress(cardId: string, username : string, progress: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards/update-card-with-progress/${cardId}/${username}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // If you need to send a token, include it here:
      // 'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ progress: progress })
    // credentials: 'include', // This is needed if you're using cookies for authentication
  });
}

export async function getTemporaryCardSet(numCards: number, username : string) {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/cards/tempCardSet`;
  
  const body = {
    num_cards: numCards === -1 ? null : numCards,
    username: username,
};

const response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        // Include CSRF token if your Django setup requires it
        // 'X-CSRFToken': getCsrfToken(),
    },
    body: JSON.stringify(body),
});
console.log("response");
const res = response.json();
console.log(res);
  if (!response.ok) {
      if (response.status === 401) {
          throw new Error('User not authenticated');
      } else if (response.status === 404) {
          throw new Error('No cards found and no fallback set provided');
      } else {
          throw new Error('Network response was not ok');
      }
  }
  return res;
}

export async function getAllCardSets() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards/CardSets/`);

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}