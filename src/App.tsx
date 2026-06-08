import { BubbleNavigation } from "./components/navigation/BubbleNavigation";
import { FluidGlassCursor } from "./components/reactbits/FluidGlassCursor";
import { GalleryDetailPage } from "./pages/GalleryDetailPage";
import { GalleryPage } from "./pages/GalleryPage";
import { HomePage } from "./pages/HomePage";
import { NoteDetailPage } from "./pages/NoteDetailPage";
import { NotesPage } from "./pages/NotesPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { usePathname } from "./router";

export default function App() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  let page = <NotFoundPage />;

  if (pathname === "/") {
    page = <HomePage />;
  } else if (pathname === "/gallery") {
    page = <GalleryPage />;
  } else if (segments[0] === "gallery" && segments[1]) {
    page = <GalleryDetailPage slug={segments[1]} />;
  } else if (pathname === "/notes") {
    page = <NotesPage />;
  } else if (segments[0] === "notes" && segments[1]) {
    page = <NoteDetailPage slug={segments[1]} />;
  }

  return (
    <>
      <BubbleNavigation currentPath={pathname} />
      {page}
      <FluidGlassCursor />
    </>
  );
}
