# KirinOCR
Hekcing optical character recognizer to read @Kirinodere's japanese weeb trash

## How to install
1. Clone the repository
2. Install NodeJS (I'm using v8.11.3)
2. Install Tesseract (the actual OCR engine)
3. Run the app using `npm run start`, and drag/resize the app so that the the red box is over the text to recognize:

![Image of this mediocre tool at work](https://i.imgur.com/zZBkLzC.png)

4. Copy-paste the output in the darker box below it using CTRL+C/CTRL+V


## Installing Tesseract on MacOS

First, we will install something called '[Homebrew](https://brew.sh)' by running the following in the **Terminal** app:

```/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"```

After this is done, we'll use the now-installed Homebrew to install NodeJS by running the following in the **Terminal** app:

``` brew install node```

After this is done, we can install Tesseract by running the following in the **Terminal** app as well.
Do mind that one this takes quite some time (like 5 minutes or so), as it'll manually "build" all the Tesseract code:

```brew install tesseract --with-all-languages```

## Installing Tesseract on Windows

I have no idea, and if you're willing to figure this out, feel free to contribute any changes and adjust this readme.

## FAQ

**Q: Why is this code so fricking horrible**

A: Go away Kuroneko.

**Q: Why is this app making 100s of screenshots in my temp folder??**

A: Because NodeJS's open source community is in such a state that for every hekcing thing there is, 
you can choose between like 11 packages that all do what you need, except none of them actually work 100%, 
but when you find the one that's kind of doing what you're trying to accomplish, then that's the one you need.
This happened here as well, hence the need to install Tesseract separately. THANKS FAM!

Besides all that, I looked into it, and it seems to be fine (at least on Mac) as it stored them to your 'temp' folder,
which means they'll be removed either when macOS needs space, or on restart/boot time.

**Q: Why isn't this packaged into a standalone Electron app?**

A: Two reasons: 1. I tried, and it didn't work after booting the app, and 2. Idgaf. Feel free to fix this issue if you can.

**Q: Ur husbando is a pidgeon**

A: That's not a question
