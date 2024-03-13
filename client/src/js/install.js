const butInstall = document.getElementById('buttonInstall');

let deferredPrompt; // To store the event for later use

// Logic for installing the PWA
// Add an event handler to the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  event.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = event;
  // Update UI to notify the user they can add to home screen
  butInstall.style.display = 'block';
});

// Implement a click event handler on the `butInstall` element
butInstall.addEventListener('click', async () => {
  if (deferredPrompt) {
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;
    // Reset the deferredPrompt variable as it can only be used once
    deferredPrompt = null;
    // Hide the install button regardless of the user's choice
    butInstall.style.display = 'none';
    // Log the user's choice (either "accepted" or "dismissed")
    console.log('User choice:', choiceResult.outcome);
  }
});

// Add a handler for the `appinstalled` event
window.addEventListener('appinstalled', (event) => {
  // Log the app being installed
  console.log('App installed:', event);
});
