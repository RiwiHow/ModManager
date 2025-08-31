dist-python:
    source ./backend/.venv/bin/activate
    pyinstaller --distpath ./backend/dist --workpath ./backend/dist/build --specpath ./backend/dist/spec --onefile ./backend/src/main.py

dist-vite:
    cd ./frontend && bun run build

dist:
    just dist-python
    just dist-vite
    cd ./frontend && bun run dist