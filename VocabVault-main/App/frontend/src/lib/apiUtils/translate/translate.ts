// app/api/translate/page.ts

export async function translateWord(uid: string, txt: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards/trans/${uid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ txt: txt, source : "EN", target : "DE" }),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}