const VideoSection = () => {
    return (
        <section className="video-container my-8 md:my-12">
            <div className="video-overlay"></div>
            <video
                className="w-full h-full object-cover z-10 relative"
                autoPlay
                loop
                muted
                playsInline
                width="2000"
                height="750"
            >
                <source src="/assets/videos/cbumtraining.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </section>
    );
};

export default VideoSection;
