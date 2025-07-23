const VideoSection = () => {
    return (
        <div className="video-container">
            <div className="video-overlay"></div>
            <video width="2000" height="750" autoPlay loop muted playsInline>
                <source src="/assets/videos/cbumtraining.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoSection;
