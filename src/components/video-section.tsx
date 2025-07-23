const VideoSection = () => {
    return (
        <section className="relative w-full h-[75vh] overflow-hidden my-8 md:my-12">
            <div className="absolute inset-0 z-0" style={{
                backgroundImage: 'linear-gradient(45deg, rgba(229, 0, 0, 0.212) 25%, transparent 25%, transparent 75%, rgba(229, 0, 0, 0.212) 75%, rgba(229, 0, 0, 0.212)), linear-gradient(45deg, rgba(229, 0, 0, 0.212) 25%, transparent 25%, transparent 75%, rgba(229, 0, 0, 0.212) 75%, rgba(229, 0, 0, 0.212))',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 10px 10px',
            }}></div>
            <video
                className="w-full h-full object-cover z-10 relative"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src="/assets/videos/cbumtraining.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </section>
    );
};

export default VideoSection;
