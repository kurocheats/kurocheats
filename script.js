function startSite() {
  document.querySelector('.overlay').style.display = 'none';

  const audio = document.getElementById('bgAudio');
  const volumeSlider = document.getElementById('volumeSlider');

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaElementSource(audio);

  source.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = 256;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  audio.volume = volumeSlider.value / 100;

  volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 100;
  });

  function updateParticles() {
    analyser.getByteFrequencyData(dataArray);

    const bassSum = dataArray.slice(0, 6).reduce((a, b) => a + b, 0);
    const bassAverage = bassSum / 6;
    const normalizedBass = Math.pow(bassAverage / 255, 2);

    const midSum = dataArray.slice(6, 20).reduce((a, b) => a + b, 0);
    const midAverage = midSum / 14;
    const normalizedMid = midAverage / 255;

    const pJS = window.pJSDom[0].pJS;
    pJS.particles.array.forEach(particle => {
      particle.radius = 2 + normalizedBass * 12;

      if (normalizedBass > 0.4) {
        particle.velocity.y -= normalizedBass * 2;
      }

      const energyMultiplier = 1 + normalizedBass * 2;
      particle.velocity.x *= energyMultiplier;
      particle.velocity.y *= energyMultiplier;
    });

    pJS.particles.line_linked.opacity = 0.1 + normalizedMid;
    pJS.particles.line_linked.width = 1 + normalizedBass * 3;

    requestAnimationFrame(updateParticles);
  }

  audio.play();
  updateParticles();
}

particlesJS('particles-js', {
  particles: {
    number: {
      value: 60,
      density: {
        enable: true,
        value_area: 1500
      }
    },
    color: {
      value: '#4F8CFE'
    },
    shape: {
      type: 'circle'
    },
    opacity: {
      value: 0.5,
      random: true,
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 2,
      random: true,
      anim: {
        enable: true,
        speed: 2,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#4F8CFE',
      opacity: 0.2,
      width: 1
    },
    move: {
      enable: true,
      speed: 3,
      direction: 'none',
      random: true,
      straight: false,
      out_mode: 'bounce',
      bounce: true,
      attract: {
        enable: true,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: true,
        mode: 'grab'
      },
      onclick: {
        enable: true,
        mode: 'repulse'
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 200,
        line_linked: {
          opacity: 0.8
        }
      },
      repulse: {
        distance: 200,
        duration: 0.8
      }
    }
  },
  retina_detect: true
});
