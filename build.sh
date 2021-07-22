if deno compile --import-map=import_map.json --unstable main.ts; then
		echo "Yay! Build complete!"
else
		echo "Build failed!"
fi
