'use client';

export default function Error({ error, reset }) {
  return (
    <div className="error">
      <h2>Something went wrong! Please Try again later.</h2>
      <p>Possible Error: {error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
