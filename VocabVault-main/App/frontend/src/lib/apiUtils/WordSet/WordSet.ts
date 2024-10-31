// app/api/WordSet/page.ts

export async function createWordSet(WordSet:any, username: string) {
  console.log("WordSet", WordSet);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards/createCardSet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ WordSet, username }),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}