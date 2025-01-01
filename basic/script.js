async function loadWordMapping(params) {
    try {
        const response = await fetch('../data/per-font-family/Hafs_Word_QCF_01.json');
        const data = await response.json();
        const hafsWordMapping = data.Hafs_Word;
        return hafsWordMapping;
    } catch (error) {
        console.error('Error loading JSON data:', error);
        return [];
    }
}

async function loadSurahNameMapping(params) {
    try {
        const response = await fetch('../data/Hafs_Sura.json');
        const data = await response.json();
        const hafsWordMapping = data.Hafs_Sura;
        return hafsWordMapping;
    } catch (error) {
        console.error('Error loading JSON data:', error);
        return [];
    }
}

// Word type mapping
// 1	Quran Words
// 2	Waqf Markes
// 3	Sagda Line
// 4	Basmala
// 5	Sura Name
// 6	Aya Number
// 7	Quarter Mark
// 8	Sagda Markes

async function populateAyat(params) {
    const wordMapping = await loadWordMapping();
    const surahMapping = await loadSurahNameMapping();

    const bodyElement = document.getElementById('body');

    // Override for RTL text direction
    const rtlOverride = '‮';

    // Create the outer div to hold all Surahs
    const surahDiv = document.createElement('div');

    let currentSurah = null;

    // Iterate over the wordMapping
    for (let i = 0; i < wordMapping.length; i++) {
        // Check if the current Surah is different from the previous one
        if (wordMapping[i].Sura !== currentSurah) {
            // If there is a previous Surah, append the paragraph
            if (currentSurah !== null) {
                // Append the surahParagraph to the surahDiv
                surahDiv.appendChild(surahParagraph);
            }

            // Update the current Surah
            currentSurah = wordMapping[i].Sura;

            // Create a new div for the Surah title
            const surahTitle = document.createElement('div');
            surahTitle.className = 'surah-title';
            surahTitle.innerText = `Surah ${surahMapping[currentSurah - 1]?.Name ?? 'Unknown'}`;
            surahDiv.appendChild(surahTitle);

            // Create a new paragraph for the current Surah's ayat
            surahParagraph = document.createElement('p');
            surahParagraph.className = 'ayat-quran';
            surahParagraph.innerHTML += rtlOverride;  // Apply RTL override
        }

        // Add the current word to the surahParagraph
        surahParagraph.innerHTML += `<span style="font-family: ${wordMapping[i].FontName}_COLOR;">&#${wordMapping[i].FontCode};</span> `;
        // Basmalah
        if (wordMapping[i].Type == 4) {
            surahParagraph.innerHTML += '<br>';
        }
    }

    surahDiv.appendChild(surahParagraph);

    bodyElement.appendChild(surahDiv);
}

populateAyat();