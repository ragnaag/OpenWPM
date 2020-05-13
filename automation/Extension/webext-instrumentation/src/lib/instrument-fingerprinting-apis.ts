export const instrumentFingerprintingApis = ({
  instrumentObjectProperty,
  instrumentObject,
}) => {
  // Access to navigator properties
  const navigatorProperties = [
    "appCodeName",
    "appName",
    "appVersion",
    "buildID",
    "cookieEnabled",
    "doNotTrack",
    "geolocation",
    "language",
    "languages",
    "onLine",
    "oscpu",
    "platform",
    "product",
    "productSub",
    "userAgent",
    "vendorSub",
    "vendor",
  ];
  navigatorProperties.forEach(property => {
    instrumentObjectProperty(window.navigator, "window.navigator", property);
  });

  // Access to screen properties
  // instrumentObject(window.screen, "window.screen");
  // TODO: why do we instrument only two screen properties
  const screenProperties = ["pixelDepth", "colorDepth"];
  screenProperties.forEach(property => {
    instrumentObjectProperty(window.screen, "window.screen", property);
  });

  // Access to plugins
  const pluginProperties = [
    "name",
    "filename",
    "description",
    "version",
    "length",
  ];
  for (const plugin of window.navigator.plugins) {
    const pluginName = plugin.name;
    pluginProperties.forEach(property => {
      instrumentObjectProperty(
        window.navigator.plugins[pluginName],
        "window.navigator.plugins[" + pluginName + "]",
        property,
      );
    });
  }

  // Access to MIMETypes
  const mimeTypeProperties = ["description", "suffixes", "type"];
  for (const mimeTypeObj of window.navigator.mimeTypes) {
    const mimeType = mimeTypeObj.type;
    mimeTypeProperties.forEach(property => {
      instrumentObjectProperty(
        window.navigator.mimeTypes[mimeType],
        "window.navigator.mimeTypes[" + mimeType + "]",
        property,
      );
    });
  }
  // Name, localStorage, and sessionsStorage logging
  // Instrumenting window.localStorage directly doesn't seem to work, so the Storage
  // prototype must be instrumented instead. Unfortunately this fails to differentiate
  // between sessionStorage and localStorage. Instead, you'll have to look for a sequence
  // of a get for the localStorage object followed by a getItem/setItem for the Storage object.
  const windowProperties = ["name", "localStorage", "sessionStorage"];
  windowProperties.forEach(property => {
    instrumentObjectProperty(window, "window", property);
  });
  instrumentObject(window.Storage.prototype, "window.Storage");

  // Access to document.cookie
  instrumentObjectProperty(window.document, "window.document", "cookie", {
    logCallStack: true,
  });

  // Access to document.referrer
  instrumentObjectProperty(window.document, "window.document", "referrer", {
    logCallStack: true,
  });

  // Access to canvas
  instrumentObject(window.HTMLCanvasElement.prototype, "HTMLCanvasElement");

  const excludedProperties = [
    "quadraticCurveTo",
    "lineTo",
    "transform",
    "globalAlpha",
    "moveTo",
    "drawImage",
    "setTransform",
    "clearRect",
    "closePath",
    "beginPath",
    "canvas",
    "translate",
  ];
  instrumentObject(
    window.CanvasRenderingContext2D.prototype,
    "CanvasRenderingContext2D",
    { excludedProperties },
  );

  // Access to webRTC
  instrumentObject(window.RTCPeerConnection.prototype, "RTCPeerConnection");

  // Access to Audio API
  instrumentObject(window.AudioContext.prototype, "AudioContext");
  instrumentObject(window.OfflineAudioContext.prototype, "OfflineAudioContext");
  instrumentObject(window.OscillatorNode.prototype, "OscillatorNode");
  instrumentObject(window.AnalyserNode.prototype, "AnalyserNode");
  instrumentObject(window.GainNode.prototype, "GainNode");
  instrumentObject(window.ScriptProcessorNode.prototype, "ScriptProcessorNode");
};
