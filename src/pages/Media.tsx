import MediaList from "../features/media/MediaList";

export default function Media() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Media</h1>
        <p className="page-subtitle">
          Track what you watch, read, and listen to.
        </p>
      </header>

      <MediaList />
    </div>
  );
}
