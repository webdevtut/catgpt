export const config = {
  runtime: "edge",
};
export default async function handler(req) {
  try {
    const { message } = await req.json();
  } catch (e) {
    console.log("An Error Occured in send Message", e);
  }
}
