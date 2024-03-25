from pytube import Playlist, YouTube
from pytube.exceptions import VideoUnavailable

playlist_url = 'https://www.youtube.com/watch?v=a5pPQr_QwEQ&list=PL_Bj8MwxMrhpVCGjA2wuMjAntQ1lmQYKF'
p = Playlist(playlist_url)

print(f'{p.video_urls}')
for url in p.video_urls:
	try:
		yt = YouTube(url)
		print(f'Video {url} is Downloading')
		if(yt.streams.get_by_resolution("1080p")):
			yt.streams.get_by_resolution("1080p").download("./DTT")
		else:
			yt.streams.get_by_resolution("720p").download("./DTT")
	except VideoUnavailable:
	 	print(f'Video {url} is unavaialable, skipping.')
	