// ==================== BOOK CONTENT ====================
// Chapter content for each book. Keyed by book ID (matches BOOKS in books-data.js).
// Each book has 2-3 sample chapters. This is the single source of truth for reader.php.

const BOOK_CONTENT = {

    // ── 1. The Greatest Estate Developer ──────────────────────────────────────
    1: {
      chapters: [
        {
          title: "Chapter 1: A Civil Engineer's Second Life",
          content: `The last thing Kim Suho remembered was the number 47 bus and a patch of black ice.
  
  Then nothing.
  
  Then everything.
  
  He opened his eyes to a ceiling of dark oak beams, a candle guttering in a brass holder on the nightstand, and a crushing headache that felt like someone had driven a pile through his skull. Which, given what he'd been studying for the past four years, he found morbidly appropriate.
  
  He sat up slowly. The room was large, drafty, and aggressively medieval. Stone walls. A fireplace that hadn't been lit. A wardrobe that looked like it weighed as much as a compact car. Through the narrow window, he could see a courtyard that hadn't seen maintenance in what appeared to be several years — cracked flagstones, a fountain clogged with dead leaves, a garden that had long since declared independence from human oversight.
  
  His hands. He looked at his hands. They were soft. Well-kept. The hands of someone who had never once mixed concrete or hauled rebar.
  
  "Young Master?" A knock at the door. A young servant girl peered in, eyes wide with nervous energy. "You're awake. Shall I inform the Count?"
  
  Kim Suho — who was apparently no longer Kim Suho, civil engineering student, age twenty-three, deceased — thought very carefully about his next words.
  
  "Yes," said Lloyd Frontera, third son of Count Frontera, laziest noble in the Western Continent, in a voice that surprised even him with its steadiness. "Tell my father I'd like to speak with him. And..." He glanced out the window at the ruined courtyard. An idea, precise and structural, was already taking shape behind his eyes. "Bring me paper. And something to draw with."
  
  The girl blinked. "Paper, Young Master? You've never asked for—"
  
  "Paper," he repeated. "Please."
  
  Because Lloyd Frontera had been reborn with the memories of a man who could look at that crumbling courtyard and see not decay, but load-bearing potential.
  
  He was going to need a lot of paper.`,
        },
        {
          title: "Chapter 2: The Frontera Estate",
          content: `The state of the Frontera estate was, in the technical terminology of his previous life, an absolute disaster.
  
  Lloyd stood in the middle of the main hall and turned a slow circle, cataloguing. Water damage along the north wall — probably a failed drainage channel, he'd need to check the grade of the land uphill. The floor joists in the east wing were visibly sagging; he'd heard them creak under his feet with the distinctive groan of wood under stress it wasn't designed to bear. The courtyard fountain's basin had cracked, which meant water had been pooling against the foundation for years.
  
  His father, Count Aldric Frontera, watched him from across the hall with an expression caught somewhere between confusion and wariness. He was a tall man, greying at the temples, with the look of someone who had once been formidable and was now simply tired.
  
  "You've been walking around the estate for three hours," the Count said.
  
  "Mm." Lloyd crouched to press his palm against the flagstone floor, feeling the slight give that suggested the substrate beneath had shifted. "Father, when was the east wing last reinforced?"
  
  "I... don't know. Before my time."
  
  "And the drainage on the north slope?"
  
  "Lloyd." The Count's voice sharpened. "What is this about? Yesterday you were in bed complaining of a headache. Today you're—"
  
  "Taking stock." Lloyd stood. He'd filled six pages of rough sketches — elevation notes, drainage patterns he'd inferred from the staining on the walls, a rough soil assessment based on what he'd seen near the collapsed garden wall. "We have significant structural issues. The good news is that most of them are fixable with labour and the right materials. The bad news is that fixing them will cost money we apparently don't have."
  
  His father's jaw tightened. "You know about the debts."
  
  "I guessed." Lloyd had guessed from the state of the place — neglect of this scale was always financial before it was physical. "Here's what I'd like to propose."
  
  He held out the sketches. His father took them with the careful wariness of a man who expected a trick.
  
  "Phase one," Lloyd said. "We fix the drainage. It's destroying the foundation and it's the cheapest problem to solve — mostly labour, minimal materials. Phase two, we address the east wing floor before it collapses on someone. Phase three..." He pointed to a rough sketch of the courtyard. "We rebuild the fountain. I know that sounds frivolous, but hear me out. A working estate looks prosperous. Prosperous estates attract tenants. Tenants generate income. Income funds the rest."
  
  Count Frontera stared at the sketches for a long moment. Then he looked up at his son — his lazy, useless youngest son who had never in his life shown interest in anything more demanding than sleeping past noon.
  
  "Who are you?" the Count said quietly.
  
  Lloyd almost smiled. "Someone who knows how to build things."`,
        },
        {
          title: "Chapter 3: The First Project",
          content: `Getting the labour was easier than he expected, once people understood he actually knew what he was doing.
  
  The tenant farmers had been suspicious at first — understandably so, given that the young master had never previously demonstrated awareness that tenant farmers existed. Lloyd had shown up at the largest farm on the estate at dawn, in practical clothes he'd had to argue a bewildered valet into providing, carrying his sketches and a rough survey kit he'd improvised from a plumb line and a straight piece of lumber.
  
  "I need to understand the slope from here to the manor," he'd told the farmer — a heavyset man named Bren with forearms like oak branches and the deeply weathered look of someone who'd been working the same land for thirty years. "Specifically where the water goes when it rains hard."
  
  Bren had looked at him for a long, measuring moment. Then he'd pointed. "There. That low patch. Every spring it floods. Ruins half our barley."
  
  "I know." Lloyd crouched, sighting along the lumber. "I think I know why. And I think we can fix it."
  
  It had taken two days of surveying on foot to confirm what the water staining on the manor walls had already told him: the original estate drainage had been designed by someone who either didn't understand hydrology or had stopped caring. The channels that were supposed to carry water away from the buildings were, in several places, actively channelling it toward them instead. The solution wasn't complicated — it was a question of redirecting, re-grading, and in two critical spots, digging new channels entirely.
  
  "You want us to dig," Bren said, looking at the sketches Lloyd had laid out on his kitchen table.
  
  "Three channels. Specific grades — I'll mark them for you. The spoil from this one—" he pointed "—goes here, to build up this low area so it stops flooding your field."
  
  Bren was quiet for a moment. His wife, who had been quietly listening from across the room, spoke up. "And the manor stops flooding our drainage in return?"
  
  "The manor stops flooding. Full stop." Lloyd met her eyes. "The drainage is failing the whole estate, not just us. Fix it once, properly, and it stays fixed."
  
  There was a long silence.
  
  "My cousin does stonework," Bren said finally. "If you need channels lined."
  
  "I'd like to meet him."
  
  That had been a week ago. Now Lloyd stood at the top of the north slope with a crew of twelve, watching the first channel take shape. It was rough work — nothing like the precision machinery of his previous life — but the principles were the same. Grade. Flow. Redirect.
  
  Water didn't care if you were doing civil engineering or medieval earthworks. It went where gravity told it to.
  
  He just had to be smarter than the water.`,
        },
      ],
    },
  
    // ── 2. Solo Leveling ──────────────────────────────────────────────────────
    2: {
      chapters: [
        {
          title: "Chapter 1: The World's Weakest Hunter",
          content: `The gate opened at 6:47 in the morning, between a convenience store and a dry cleaner's on the corner of Jongno-gu.
  
  Sung Jinwoo was already there. He was always there early — not out of enthusiasm, but because the bus that ran to this part of the city only came twice an hour, and missing it meant a forty-minute walk in the dark. He stood with his hands in the pockets of his jacket, watching the other hunters assemble, and tried not to think about the bills on his kitchen table.
  
  His mother's hospital. His sister's school fees. The rent, three weeks overdue.
  
  "E-rank again?" The voice belonged to one of the C-ranks — a broad-shouldered man named Park with an ice magic affinity and the casual contempt of someone who had never once had to think about whether he could afford to eat this week. He was looking at Jinwoo the way most hunters looked at Jinwoo: with a mixture of pity and mild irritation, the way you might look at a stray dog that kept showing up at the same spot.
  
  "E-rank," Jinwoo agreed pleasantly.
  
  "You know you could die in there."
  
  "I know."
  
  Park shook his head and moved on, joining the cluster of higher-ranked hunters near the gate. Jinwoo watched him go. He'd been hearing variants of this conversation for two years. You're too weak. You shouldn't be here. You're going to get yourself killed.
  
  All of them were right, technically. E-rank hunters were the lowest of the low — barely above civilians, with stat improvements so minimal they were almost a cruel joke. The system that had appeared ten years ago and changed the world had distributed its gifts very unevenly. Some people awakened as S-ranks, capable of things that rewrote what humans believed was possible. Most people who awakened at all were C or D. Jinwoo had gotten E.
  
  But E-rank hunters could still enter gates. And even the lowest-tier gates paid enough to cover the minimum payment on his mother's hospital bills.
  
  So here he was.
  
  The gate pulsed — that deep, resonant shimmer that Jinwoo had learned to read like weather. D-rank dungeon. Manageable. Probably wolves or the lesser variants of stone golems.
  
  He checked his gear: cheap armour, a short sword that had been secondhand when he bought it and was now on its third owner at minimum, a healing potion that he'd ration carefully because one cost half a day's earnings.
  
  The gate opened fully.
  
  Jinwoo walked in.`,
        },
        {
          title: "Chapter 2: Double Dungeon",
          content: `The dungeon had been wrong from the start. Jinwoo had felt it the moment they'd cleared the third room.
  
  Standard D-rank dungeons didn't have hidden doors. Standard D-rank dungeons didn't have rooms behind rooms, deeper chambers with a different quality of darkness — something thick and deliberate, as if the space itself was aware of their presence. Standard D-rank dungeons didn't have statues.
  
  There were twelve of them, arranged in a perfect circle around a stone altar. Each was carved in perfect detail — robes, faces, hands clasped in what might have been prayer or might have been supplication. Their eyes were closed. Their expressions were serene.
  
  Jinwoo stood at the edge of the chamber and looked at them and felt the particular cold that had nothing to do with temperature.
  
  "This isn't right," he said quietly.
  
  Nobody listened. The other hunters were already moving into the room, drawn by the altar and what sat atop it — a gemstone the size of a fist, glowing with soft blue light. One of them, a B-rank he didn't know, was already reaching for it.
  
  "Wait—"
  
  The eyes of the statues opened.
  
  What followed was chaos. The statues moved with a speed that should have been impossible for stone — fluid, purposeful, brutal. The hunters who'd been nearest the altar went down first. Jinwoo had moved on pure instinct, throwing himself backward toward the doorway they'd entered through, and the door wasn't there anymore, just smooth stone, and the screaming behind him was already thinning out.
  
  He pressed his back against the wall and breathed and tried to think.
  
  The statues had rules. He'd seen that already in the first thirty seconds — they stopped when everyone stopped moving. They paused when no one spoke. They were responding to something.
  
  He looked down. Cut into the floor, barely visible in the dim light of the altar stone, were words.
  
  Rules of the Architect. He read them once, quickly, and his stomach dropped.
  
  The chamber had a solution. A terrible, specific solution that required exactly the right behaviour, the right words, the right sequence of actions.
  
  There were three hunters left alive besides him, crouched in the far corner. One was badly wounded. None of them would make it if this went wrong.
  
  Jinwoo looked at the words on the floor. He looked at the statues, motionless and waiting. He looked at the survivors.
  
  He made a decision.
  
  "Listen to me," he said quietly. "I know how to get us out."`,
        },
        {
          title: "Chapter 3: The System Awakens",
          content: `He hadn't gotten them out.
  
  Jinwoo lay on the floor of the chamber with his body broken in ways that made clinical inventory feel like the only thing keeping him sane. Three ribs, definitely. His left arm was wrong. Something in his chest made breathing a negotiation.
  
  The other survivors were gone. He'd managed to keep two of them alive through the rules, guided them through every step he'd read on the floor — but the door had only opened once, and they'd had to leave him behind to hold the last statue in place. There had been no other choice. He'd told them to go. They'd gone.
  
  He was alone in the chamber. The altar stone still glowed. His healing potion had shattered in the chaos.
  
  This was how it ended, then. Not even a proper fight — a trap in a trap, a dungeon within a dungeon, and the world's weakest hunter was going to die in a way that would probably make a moderately interesting news story before everyone forgot about him.
  
  His vision was going grey at the edges when the light appeared.
  
  Not the altar stone's light. Something else. Something that seemed to come from inside his own eyes, a pale luminescence that resolved, with dreamlike unhurriedness, into text.
  
  A quest has been completed.
  Congratulations on surviving the trial.
  You have been selected as a Player.
  
  Jinwoo blinked. The text remained.
  
  Do you accept?
  
  He thought, distantly, that he might be hallucinating. Blood loss could do that. But the alternative was simply dying, and he'd spent two years choosing not to die when that would have been the easier option.
  
  Yes, he thought.
  
  The pain didn't stop. But something shifted — deep in his cells, in the architecture of whatever he was, a door opened that had been shut his entire life.
  
  A stat window appeared before him.
  
  His eyes moved to the bottom line. The line that, for two years, had read the same shameful number.
  
  It did not read the same number.
  
  His level was still 1. But next to it, where every other hunter's stat window showed a fixed rank that never changed, his showed something different.
  
  It showed a prompt.
  
  Grow.`,
        },
      ],
    },
  
    // ── 3. The Apothecary Diaries ─────────────────────────────────────────────
    3: {
      chapters: [
        {
          title: "Chapter 1: The Rear Palace",
          content: `Maomao had been in the rear palace for three months before she allowed herself to admit it was interesting.
  
  Not enjoyable. Not desirable. Certainly not the outcome she would have chosen, given the choice, over remaining in the pleasure district where she'd grown up, learning her father's trade, spending her days grinding medicines and puzzling out the logic of illness and cure. Being sold to the imperial palace as a servant was not, by any reasonable measure, a good thing that had happened to her.
  
  But interesting. Yes, she could concede that.
  
  The rear palace was where the Emperor's consorts lived — his wives and favoured concubines, ranked in careful hierarchy, attended by hundreds of servants and eunuchs, insulated from the outside world by walls and protocol and the elaborate machinery of imperial favour. Maomao had been assigned to the lowest tier, fetching water and cleaning rooms, deliberately inconspicuous, counting the months until her contract ended.
  
  Then the babies had started dying.
  
  She'd heard about it in the servant's corridors — the consort Lihua's infant, then the consort Gyokuyo's. Two children dead, one gravely ill. The physicians of the palace had examined them and found nothing. The astrologers had consulted their charts. The court was quietly frantic.
  
  Maomao had looked at the symptoms she'd heard described and thought: obviously.
  
  She had not said this aloud. She was a servant, bought at market, with no standing to offer medical opinions to imperial physicians. She was also seventeen, with a face she'd gone to some trouble to make forgettable, and the absolute last thing she wanted was to attract attention.
  
  She had, however, left an anonymous note.
  
  A suggestion. Specific. About the consorts' cosmetics.
  
  She had not expected it to work. She had expected it to be ignored, the way useful information delivered by the wrong person through the wrong channels almost always was.
  
  Instead, three days later, a eunuch she'd never seen before appeared in the doorway of the laundry room where she was working and looked at her with eyes the colour of pale amber and said, simply: "You wrote the note."
  
  It wasn't a question.
  
  Maomao wrung out the cloth she was holding and considered, briefly, denying it. Then she looked at his face more carefully, and decided this was not a person who would be usefully deceived.
  
  "The lead," she said. "It's in the white powder they use. The children were being exposed through skin contact." She paused. "Your eyes are an unusual colour for someone born in this country."
  
  The eunuch's expression didn't change. "So are your sleeves."
  
  She looked down. The hem of her left sleeve had ridden up. The edges of old scars were visible — her own experiments, conducted with careful methodology and detailed notes, the way her father had taught her. She pulled the sleeve down.
  
  "Maomao," she said. "That's my name."
  
  "Jinshi," he said. "I have a proposition for you."
  
  She had a feeling she wasn't going to like it.
  
  She was right. She took it anyway.`,
        },
        {
          title: "Chapter 2: The Food Taster",
          content: `The role of food taster was, Maomao reflected, professionally fascinating and personally inconvenient.
  
  Professionally: she tasted everything Jinshi ate before he ate it, which meant she had access to the imperial kitchens, the authority to examine preparations, and a front-row position from which to observe the intersection of food, poison, politics, and human nature that characterised life at the highest levels of the palace. Any competent apothecary could have told you that most of what people called 'poison' in popular understanding was either wrong, exaggerated, or easily detected. The actual art of poisoning — the real, sophisticated kind — was rarer and more interesting. She was learning.
  
  Personally: it meant spending significant amounts of time in Jinshi's company, and Jinshi was, she had concluded, a problem.
  
  Not in the way most women seemed to find him a problem, which was to say they did not find him a problem at all but rather immediately lost the ability to think clearly in his presence. He was beautiful in the specific way that a very finely made weapon was beautiful — the kind of beauty that was clearly the result of considerable effort, applied over considerable time, for a specific purpose. She had catalogued the techniques: the particular angle at which he held his head, the deployment of his smile, the management of eye contact. They were good techniques. Very good, in fact.
  
  She was, she felt, admirably resistant to them.
  
  "You're doing it again," Jinshi said.
  
  "Analysing your face?"
  
  "Looking at me like I'm a specimen."
  
  "You have an interesting face. The bone structure suggests—"
  
  "Maomao."
  
  "—mixed heritage, which would explain the eye colour—"
  
  "I have a case for you." He slid a folded paper across the table. "A concubine in the third tier has been unwell for six weeks. The palace physicians say it's spiritual in origin."
  
  Maomao unfolded the paper. Symptoms, written in a tidy hand. She read them once and looked up. "It's not spiritual."
  
  "No."
  
  "The headaches and the pallor together suggest — is she from the northern provinces originally?"
  
  Jinshi's expression shifted very slightly, in the way she'd learned to read as confirmation combined with mild surprise that she'd got there so quickly. "Her family estate is in the north."
  
  "Mountain water." Maomao folded the paper back along its original creases. "They often have elevated levels of certain minerals. She's been drinking the same water from home that she drank all her life, but her body is older now and less adaptable. It's accumulating. The solution is simple — switch her water source and give it two months."
  
  "That's all?"
  
  "That's all." She paused. "Though if you wanted to be thorough, I'd suggest examining whether any of the other northern concubines are showing early-stage symptoms. Prevention is—"
  
  "More efficient than treatment. Yes, you've mentioned." Jinshi was doing the thing with his expression that she'd categorised as 'almost-smiling but maintaining deniability.' "You're good at this."
  
  "My father's an apothecary." She stood. "Is that all you needed?"
  
  "For now." He was watching her with those pale eyes. "You never seem even slightly affected."
  
  "By what?"
  
  He gestured, vaguely, at himself.
  
  Maomao considered several responses. She chose: "Your food is getting cold."
  
  And left before he could see that she was, in fact, thinking about it.`,
        },
      ],
    },
  
    // ── 4. The Beginning After The End ───────────────────────────────────────
    4: {
      chapters: [
        {
          title: "Chapter 1: Death of a King",
          content: `The assassin was good. King Grey would give him that.
  
  He'd bypassed seven layers of palace security — not all of them magical, not all of them visible, all of them specifically designed for someone who might know about the previous six. He'd waited in the one room in the palace where a shadow could pool in exactly the right configuration to conceal a man of precisely his dimensions. He'd timed his strike for the three-second window between patrols.
  
  He was good.
  
  Grey had known he was there for forty minutes.
  
  He finished the glass of wine he'd been drinking and set it down on the desk with a precise click. Behind him, the shadow moved.
  
  "You can stop," Grey said.
  
  The movement stopped.
  
  "I'm not going to pretend I don't know you're there. You've been very patient. That deserves acknowledgment." He turned in his chair. The assassin was good-looking, in the deliberately forgettable way that suggested serious training — features arranged for maximum unmemorability. His blade was already drawn. His eyes were the steady, professional eyes of someone who had made a decision and arrived at peace with it. "Who sent you?"
  
  "Does it matter?"
  
  "Not particularly. But you went to a great deal of effort, and I'm curious about the motivation."
  
  A flicker — professional composure briefly adjacent to something else. "You're not afraid."
  
  "I've been doing this for twenty years. Being afraid of assassins would be exhausting." Grey folded his hands. "The blade you're carrying is interesting. Mana-null edge. Disrupts the ambient field. Makes shields difficult." He paused. "Whoever sent you did their research."
  
  The assassin moved.
  
  Grey was faster. He had always been faster — not because of talent, or natural gifts, but because he had spent twenty years building a body that was faster, and the foundation held even at sixty-three, even sitting down, even in the half-dark. He caught the wrist, redirected the blade, and in the same motion used the assassin's own momentum to put him face-first into the desk.
  
  He held the pin for three seconds. Then he stepped back and waited.
  
  The assassin lay still. Processing, probably, the fact that the most powerful mage-king in the continent had just taken him apart with what appeared to be purely physical technique, with no mana involved at all.
  
  "I'm tired," Grey said quietly, looking out the window. "I've been tired for a long time."
  
  He hadn't expected that to come out. He looked at the words as if examining something left by someone else.
  
  "Tired," the assassin said carefully, from the floor.
  
  "Of this." Grey's gesture encompassed the room, the palace, the city lights visible through the glass, the forty years of accumulated power that had bought him everything and left him emptier than when he'd started. "I thought—" He stopped.
  
  He had thought that getting stronger would eventually be enough.
  
  He was still thinking that when the second assassin, the one he hadn't detected, struck from the window.
  
  He died before he understood what had happened.
  
  Then he woke up crying, in a body so small he couldn't yet see over the edge of a crib, in a world that smelled like hay and woodsmoke and something new.`,
        },
        {
          title: "Chapter 2: Born Again",
          content: `He was three years old before he was entirely sure he wasn't hallucinating.
  
  The memories had been there from the start — the full weight of a previous life, sixty-three years of it, pressed into the brain of an infant who couldn't yet hold his own head up. He'd been careful about that. Very careful. Crying at the right times. Sleeping the right amounts. Expressing appropriate wonder at things he understood completely, appropriate distress at things he understood too well.
  
  His mother's name was Alice. She had pale blonde hair and a smile that reminded him of nobody he'd ever known, which he found unexpectedly comforting — there was no ghost in her face. She held him with the specific fierceness of someone who wasn't certain she deserved good things and was desperately grateful for them anyway.
  
  His father's name was Reynolds. He was a former adventurer — Grey could see it in the way he moved, the old reflexes that never fully left, the way his hand went to a hip where a weapon had once hung whenever something surprised him. He was kind in the specific, slightly awkward way of men who had learned kindness later in life and were still practising it.
  
  They named him Arthur.
  
  Arthur Leywin. He turned the name over in his mind, trying it on. It fit well enough.
  
  The village was called Ashber, and it was exactly the kind of place that King Grey would have passed through without slowing down and forgotten within the hour — small, modest, removed from the currents of power and politics that had defined his previous life. The people were farmers and craftspeople and minor adventurers taking lower-tier contracts from the local guild. Nobody was powerful. Nobody was important.
  
  He spent his first three years observing, cataloguing, and relearning the physics of his new world.
  
  It was different from his old world. Similar enough to be recognisable — mana still existed, magic still operated on broadly familiar principles — but different in the details, in the names, in the way the power structures were arranged. He needed to understand it before he could navigate it, and he was, this time, determined to navigate it better.
  
  The morning of his fourth birthday, he woke before dawn and walked to the edge of the yard, where the frost was still hard on the grass, and sat cross-legged in the way he hadn't sat in sixty years, and reached for the mana.
  
  It was there. Abundant. The body of a four-year-old with no previous cultivation — except that wasn't right, because this brain held sixty years of accumulated understanding, and understanding was, he had always believed, the most fundamental skill.
  
  He breathed. He reached. He felt the mana respond.
  
  He started again, properly this time.
  
  This time, he was going to do it right.`,
        },
      ],
    },
  
    // ── 5. Delicious in Dungeon ───────────────────────────────────────────────
    5: {
      chapters: [
        {
          title: "Chapter 1: Hot Pot / Trotters",
          content: `The dragon had eaten Falin on the thirty-second floor, and they had seventeen copper coins between them.
  
  Laios Touden sat with his back against the dungeon wall and looked at the coins and tried to think practically, because thinking practically was, at this moment, the only alternative to thinking about the look on his sister's face before the Red Dragon swallowed her whole.
  
  "We have to go back," said Marcille. She was sitting across from him with her knees drawn up and her eyes red, her grimoire clutched against her chest. "We have to resupply, get a healer, find new—"
  
  "We don't have time." Laios stared at the coins. "Dragons digest slowly, but they do digest. If we go back to the surface, get funds, assemble a new party, make the descent again—" He did the arithmetic in his head. He didn't like the result.
  
  "Then what do you suggest?" Chilchuck asked flatly, from where he was examining the lock mechanism on a chest they'd found. The halfling's voice had the careful neutrality of someone managing their own feelings by focusing very hard on technical problems. "We have seventeen copper. We have about three days of rations. We're on the twenty-second floor, which means we need to get ten floors deeper before we even reach where Falin was taken."
  
  "We eat the dungeon," Laios said.
  
  Silence.
  
  "I'm sorry," Marcille said. "We what?"
  
  "The monsters." Laios looked up. He'd been thinking about this for years, actually — the dungeon ecology was a genuine scholarly mystery, the way the creatures replenished and how they sustained themselves in an environment that should by rights have been resource-depleted centuries ago. The only logical explanation was that they were part of a cycle, and cycles meant nutrients, and nutrients meant—
  
  "They're edible?" Chilchuck said.
  
  "Everything's edible if you know how to prepare it. My hypothesis is that dungeon creatures draw mana-infused nutrients from the dungeon itself, which means they'd be genuinely calorie-dense. We have the tools. We have fire magic." He looked at Marcille, who was staring at him with the expression she usually reserved for when he suggested something she found both deeply questionable and frustratingly logical. "We just have to figure out the cooking."
  
  "This is insane," Marcille said.
  
  "Falin," Laios said simply.
  
  Another silence. This one had a different quality.
  
  Chilchuck set down his lockpick. "What do we start with?"
  
  As if in answer, the tunnel ahead of them produced the familiar skittering of something large with too many legs.
  
  "Walking mushroom," Laios said, standing and drawing his sword. He was, despite everything, smiling slightly. "I've always wanted to try one."`,
        },
        {
          title: "Chapter 2: Roast Basilisk",
          content: `The problem with cooking a basilisk, Laios explained carefully, was that you had to work fast.
  
  "The petrification is in the eyes," he said, crouching over the creature they'd managed to bring down after twenty minutes of approach from behind and careful positioning. It was about the size of a large dog, with the upper body of a rooster and the lower body of a serpent, both segments armoured in iridescent scales. "But it also secretes a milder version through the skin. You need gloves, or at minimum a barrier between you and the dermis."
  
  "I feel," Marcille said, "that this is the kind of information one should perhaps have shared before we attacked it."
  
  "You were fine. I had it handled." He was already moving — gloves on, carefully orientating the creature so its eyes faced away. "The good news is that cooking neutralises the secretion entirely. The bad news is that if you undercook it, you'll have a very bad evening."
  
  "I cannot believe," Marcille said, "that this is my life."
  
  But she was already pulling out her cooking tools.
  
  They'd been travelling with Senshi for two days now — the dwarf had appeared from around a corner on the twenty-third floor with a wheelbarrow full of equipment and the cheerful, settled air of a man who had found his purpose and was living it fully. He was, it turned out, an exceptional cook. He was also one of the most genuinely knowledgeable people Laios had ever met on the subject of dungeon ecology, which was an area Laios cared about with an intensity that most people found slightly alarming.
  
  Right now, Senshi was heating a flat stone over a small fire he'd constructed with the efficiency of long practice, examining the basilisk with a professional eye.
  
  "The tail meat will be sweetest," he said. "The breast is tougher but more flavour. If we have time, a slow roast would—"
  
  "We have time," Laios said.
  
  "We don't have time," Chilchuck said.
  
  "We have enough time to do this properly," Senshi said, with the quiet authority of someone who understood that food cooked well was not an indulgence but a form of survival. "Rushing cooking leads to rushed adventuring. Rushed adventuring leads to death. We will roast the basilisk correctly."
  
  Chilchuck looked at the ceiling. Then he sat down, because this was a battle he had already lost three times in two days and had stopped fighting.
  
  The smell, when the basilisk began to cook, was extraordinary. Rich and slightly mineral and something else underneath — the faint ozone quality that dungeon creatures seemed to carry, the trace of mana that had built them. Marcille found herself, despite herself, moving closer to the fire.
  
  "It smells like chicken," she said, offended.
  
  "Most things do," Laios said happily.`,
        },
      ],
    },
  
    // ── 6. Omniscient Reader's Viewpoint ─────────────────────────────────────
    6: {
      chapters: [
        {
          title: "Chapter 1: The Only Reader",
          content: `I had read the novel three thousand and forty-nine times.
  
  This is not a metaphor or an exaggeration. I had a spreadsheet. It tracked re-reads by date, by volume, by the sections I returned to most often, by the details I'd caught on the forty-third read that I'd missed on the first forty-two. Kim Dokja, office worker, twenty-eight years old, commuter, the single most dedicated reader of a web novel that had updated every day for ten years and had never once broken ten thousand views.
  
  I knew the story better than I knew my own life.
  
  So when the world ended — when every phone in the subway car lit up with the same notification, when a voice that was not quite human spoke from every speaker simultaneously, when the people around me started to understand that this was not a drill — I recognised it immediately.
  
  *[Three Ways to Survive the Apocalypse. Chapter 1: The End of the Ordinary World.]*
  
  I had read this chapter three thousand and forty-nine times.
  
  I knew exactly what happened next.
  
  The woman next to me was already crying. The man across the aisle had dropped his briefcase and was staring at his phone with the particular stillness of someone whose brain had stopped processing incoming information. The subway car had slowed and then stopped, and the lights were doing something that lights were not supposed to do, and somewhere ahead of us, through the windows, something was moving in the darkness of the tunnel.
  
  I put my hands in my lap and breathed.
  
  The novel had rules. The apocalypse ran on rules — specific, consistent, internally logical rules that the author had maintained for ten years with a dedication I found, in this moment, deeply comforting. Scenarios and quests and constellations and probability values. It was a system, and systems could be understood, and things that could be understood could be survived.
  
  The creature in the tunnel was a Grade 3 dokkaebi, based on what I could see of its silhouette. The scenario about to begin was the first of the main line — the Qualification Test. The duration was three hours. The survival condition was to reach the station platform.
  
  Most people on this subway car would not make it. I had read that part three thousand and forty-nine times.
  
  I was the only one who knew it.
  
  The question — the question I'd turned over in my mind during the last ten years of re-reads, never imagining I'd have to answer it for real — was: what was I going to do about that?
  
  I stood up.`,
        },
        {
          title: "Chapter 2: The Qualification Test",
          content: `The dokkaebi appeared as a hologram above us, grinning.
  
  It had the face of something that had learned to perform cheerfulness from descriptions alone, and gotten the shape right without getting the content. Too wide. Wrong timing. The kind of smile that made the primitive parts of the human brain transmit urgent messages about predation.
  
  *[Welcome, Humans, to Three Ways to Survive the Apocalypse! Today's scenario: The Qualification Test. Survive for three hours. Reach the platform. Simple, yes?]*
  
  Nobody found it simple. The car had dissolved into panic — people pressing toward the doors, which wouldn't open; people on their phones, which had no signal; people holding each other, crying, praying, demanding explanations from a universe that was not currently interested in providing them.
  
  I was already moving toward the front of the car.
  
  "Hey." A hand caught my arm. I turned. A young man — maybe twenty-two, combat-capable by the look of his build, eyes already adapting to crisis mode. "Where are you going?"
  
  "Forward."
  
  "That's where it came from."
  
  "I know." In the novel, the path to the platform ran through the creatures, not around them. There was no going around them. "I need to reach the driver's compartment. There's a maintenance access from there."
  
  He stared at me. "How do you know that?"
  
  I didn't have a good answer for that question. "I just do. Are you coming?"
  
  He came. His name, I would learn shortly, was Lee Hyunsung, and he was exactly who the novel said he was: a man with the particular moral courage that expressed itself as action before thought when other people were in danger. He would become important later. Much later.
  
  But right now, I needed his help to get through the door at the front of the car, and in exchange for that, the least I could do was keep him alive.
  
  "Stay behind me," I said. "When I say move, move immediately. Don't stop to help anyone who falls. I know that sounds—"
  
  "I understand."
  
  He did understand. That was the thing about Hyunsung — he had the kind of understanding that didn't require explanation, that grasped the calculus immediately even if it was ugly. Save the many by leaving the few. Not callousness. Pragmatism.
  
  "The creature will attack twice before it reaches us," I said, watching the tunnel ahead. "After the second attack, there's a gap. That's when we go."
  
  "How—"
  
  The first attack came.
  
  I'd read it three thousand and forty-nine times.
  
  I knew exactly when to duck.`,
        },
      ],
    },
  
    // ── 7. Eleceed ────────────────────────────────────────────────────────────
    7: {
      chapters: [
        {
          title: "Chapter 1: The Cat in the Snow",
          content: `Jiwoo found the cat on a Tuesday, which was consistent with how Tuesdays had been going for him lately.
  
  It was in the middle of the road — not quite dead, but demonstrating an impressive commitment to the ambition. Soaking wet, one eye swollen shut, the apparent survivor of an encounter that had not gone in its favour. The cars had been going around it, which was either courtesy or indifference, and in this rain and this light it was only a matter of time before one of them miscalculated.
  
  Jiwoo picked it up.
  
  He did this without hesitation, in the way that other people drank water or breathed — automatically, without consulting whatever part of the brain was supposed to weigh consequences. The cat bit him immediately, which he felt was reasonable given the circumstances, and he held it against his chest and sprinted for the nearest shelter.
  
  The cat was large. This was the first strange thing. Under the matted, sopping fur, it had the solid density of something that weighed considerably more than its size suggested. The second strange thing was the way it watched him — not with the dazed vacancy of injured animals, but with precise, focused attention, as if it was taking very detailed notes.
  
  "It's okay," he told it. "You're okay. I've got you."
  
  The cat looked at him with its one functioning eye. Its expression, if a cat could be said to have an expression that was legible in human terms, suggested that 'okay' was not how it would characterise the current situation.
  
  "I'm Jiwoo. I'm not going to hurt you." He was sheltering under the eaves of a closed shop, one hand cradling the cat, the other digging through his bag for the small first-aid kit his mother had made him carry since he was eight. "Can I look at your eye?"
  
  The cat permitted this, with the air of something making a significant concession.
  
  The eye was bad but not as bad as he'd feared — no penetration, swelling rather than rupture. He cleaned it carefully, talking the whole time, the way he always did with animals, the way he'd been told made him seem odd but that had never once not worked. The cat submitted to the examination with what Jiwoo could only read as deliberate patience, as if it was deciding something.
  
  When he'd finished, it looked at him for a long moment.
  
  Then it said, very quietly, in a voice like gravel wrapped in velvet: *You can actually understand what animals want, can't you.*
  
  Jiwoo sat back on his heels and looked at the cat.
  
  "You talked," he said.
  
  The cat closed its eye. "Don't make it strange."`,
        },
        {
          title: "Chapter 2: Kayden",
          content: `The cat's name was Kayden.
  
  This was, the cat explained with the tired patience of someone accustomed to providing unwanted information, a temporary situation. The body was a complication. He would prefer not to discuss the particulars.
  
  Jiwoo, who had some experience with beings that communicated through indirect refusal to answer direct questions — he'd grown up with cats — accepted this as much as could reasonably be accepted and focused on the parts he could work with.
  
  "Are you hungry?"
  
  Kayden looked at the bag of cat food Jiwoo had produced from somewhere with an expression that suggested 'hungry' was too small a word for what was currently happening to him.
  
  "I'll take that as yes."
  
  He lived alone — his parents worked abroad, sent money regularly, called on weekends with the specific guilt-inflected cheerfulness of people aware they were missing something. The apartment was small and clean and full of the careful order of someone who'd learned young to maintain their own environment. He made up a bed from old towels, which Kayden accepted with the dignity of someone for whom this was a significant step down but who understood that complaining would accomplish nothing.
  
  "So," Jiwoo said, sitting cross-legged on the floor. He was seventeen, earnest in the slightly excessive way of people who hadn't yet learned to perform irony as a social defence mechanism. "What are you actually?"
  
  Kayden looked at him. "A cat."
  
  "You can talk."
  
  "Cats are complicated."
  
  "That's not—" Jiwoo paused. There was something specific about the way the cat moved, he'd noticed — precise and deliberate, the kind of economy of motion that spoke of long practice. "Are you a person? Inside the cat, I mean."
  
  The silence that followed had a texture to it.
  
  "Someone tried very hard to kill me," Kayden said finally, not answering the question and answering it completely. "I survived in a form available to me. I require time to recover." He looked at Jiwoo with both eyes now — the swelling had reduced significantly overnight, faster than it should have. "You have an unusual amount of speed and physical capability for someone your age."
  
  Jiwoo blinked at the subject change. "I work out."
  
  "You saved my life by reacting to a vehicle at a speed that should have been impossible for your age and build." The cat's gaze was very direct. "I don't believe in coincidence."
  
  Jiwoo opened his mouth, and then closed it again.
  
  "I've always been a bit fast," he said carefully.
  
  "Yes," Kayden said. "I think we should talk about that."`,
        },
      ],
    },
  
    // ── 8. Frieren: Beyond Journey's End ─────────────────────────────────────
    8: {
      chapters: [
        {
          title: "Chapter 1: A Journey's End",
          content: `The Demon King had been dead for twenty-six years, and Frieren still wasn't sure what she was supposed to do with that.
  
  The celebration was well into its third hour. The royal city was lit from end to end, every window and tower and bridge strung with lanterns, the streets full of people who had grown up under the shadow of the Demon King's armies and were only now, perhaps, beginning to believe it was over. Frieren stood on a balcony above the main square and watched the light on the faces below and tried to remember if she had stood in a similar place, watching a similar scene, a thousand years ago.
  
  She thought she had. She couldn't be certain. A thousand years was a very long time.
  
  "You're being melancholy again," said Himmel.
  
  He was leaning on the balcony railing beside her, gold hair bright in the lamplight, wearing the expression she'd catalogued long ago as 'being gently difficult about something.' He was fifty-three years old and looked it — or rather, looked like someone fifty-three who had spent much of that time fighting things considerably more dangerous than people were supposed to fight. The years sat well on him. They always had.
  
  "I'm always melancholy," she said.
  
  "You're being more melancholy than usual."
  
  She considered this. "I was trying to remember how many times I've seen the end of an age."
  
  Himmel was quiet for a moment, in the way he was quiet when he was thinking about something he wanted to say carefully. He had learned to be careful with her a long time ago, which she appreciated more than she'd known how to say when he was young.
  
  "And?"
  
  "A few times." She watched a lantern drift up from the crowd below, climbing into the dark. "They all feel like this eventually. Loud, and bright, and brief."
  
  "Brief," Himmel repeated. There was something in his voice she filed away to examine later.
  
  "Compared to what comes after," she said, not quite explaining.
  
  He didn't push her to explain further. That was one of the things she'd noticed about him, over the ten years of their journey — he had learned, slowly and sometimes painfully, that there were parts of her that operated on timescales beyond his frame of reference, and he had chosen to be patient with that rather than hurt by it. She wasn't sure she'd deserved the patience. She was grateful for it nonetheless.
  
  "The others are asking for you," he said. "Heiter wants to make a toast."
  
  "Heiter always wants to make a toast."
  
  "He has many things to celebrate."
  
  She looked at the lanterns for another moment. Then she turned from the railing. "Fine."
  
  She did not know, standing there, that Himmel had perhaps fifty years left. She did not think to ask. Fifty years was, from the perspective she'd spent her entire existence inhabiting, a very long time.
  
  She would think about that later. For a very long time, she would think about that.`,
        },
        {
          title: "Chapter 2: The Elf Who Forgot",
          content: `Himmel died in the spring, as if he'd made an appointment with it.
  
  He was eighty years old. He had been, by all the measures available, happy — not in spite of the life he'd chosen but because of it, which Frieren had come to understand was not common and was not an accident. He had chosen it deliberately, every day, the happiness and the world it cost and the world it bought.
  
  He told her, near the end, that he didn't regret the years he'd spent adventuring. He told her she'd made those years strange and wonderful and unlike anything he'd expected when he set out as a young man with a sword and too much confidence. He told her something else, too, quieter, that she didn't know how to respond to.
  
  She stood at his grave for a long time. The others came and went — Heiter was older now too, Eisen was Eisen, unchanged in the way dwarves were unchanged, not immortal but long. They cried in the ways they cried. She didn't cry, which was not indifference but was something harder to explain.
  
  She left when the sun went down.
  
  She walked north, with no particular destination, in the way she did when she needed to be in motion. The world had changed in the eighty years since the Demon King's defeat — enough that the changes were legible, new villages where she'd walked through wilderness, old forests cut back, roads where there had been paths. Not unrecognisably different. Not yet.
  
  She thought: I never asked him enough questions.
  
  She thought: I should have listened better when he talked.
  
  She thought: this is what they mean, the humans, when they talk about grief.
  
  She had experienced loss before — everything that lived long enough experienced loss, that was the simple mathematics of time. But there was something specific about this loss that she was only beginning to understand, standing on a road in the dark, eighty years after a young man had introduced himself to her outside a Guild hall and told her with complete confidence that they were going to defeat the Demon King.
  
  She had known him, she realised, not nearly well enough.
  
  She had assumed there was time.
  
  She turned around and walked back to the grave. She sat down in the grass beside it, and she told him, out loud, all the things she should have asked and hadn't. The words felt insufficient and she said them anyway.
  
  Then she made herself a promise, in the particular way she made promises — without ceremony, just a noting of a fact that would now remain true until she decided it wasn't.
  
  She was going to learn how to pay attention.`,
        },
      ],
    },
  
    // ── 9. Heaven Official's Blessing ────────────────────────────────────────
    9: {
      chapters: [
        {
          title: "Chapter 1: Ascending Once More",
          content: `The third time Xie Lian ascended to the Heavenly Court, he was wearing someone else's robes.
  
  This was not the most undignified aspect of the situation, but it was the most immediately visible, and the assembled heavenly officials had opinions. He could see them having opinions in real time — the small adjustments of expression, the micro-movements of bodies arranged in hierarchy, the management of visible reactions that constituted court politics at every level.
  
  Eight hundred years. He had been human for eight hundred years. He had been, for significant portions of those eight hundred years, a scrap collector and occasional street vendor and once, briefly, a man who sang for coins outside a temple that had once been built in his honour. He had been hungry more times than he could count, and lost more things than most beings were given to lose, and the Heavenly Court had watched all of it from whatever distance the Heavenly Court maintained toward its embarrassments.
  
  Now he was back.
  
  The heavenly official who processed his return was young and earnest and clearly wanted very much not to be the one doing this. His divine register was in the process of being updated. The bureaucratic machinery of the heavens ground on regardless of what had happened in the years between.
  
  "Your Highness," the official said, with the specific tone of someone who has been instructed to use an honorific they find contextually confusing. "Your Palace of Wind and Water has been assigned. It is currently in need of some... restoration."
  
  "That's fine."
  
  "It's quite extensive restoration."
  
  "That's also fine." Xie Lian looked at the official, who looked back at him with the transparent hope that he would react in some way that clarified the situation. He didn't. After eight hundred years of practice, he had developed an equanimity that genuinely baffled people, which he found somewhat useful. "Is there anything else that requires my immediate attention?"
  
  There was, as it turned out, a curse.
  
  There was always a curse.`,
        },
        {
          title: "Chapter 2: The Ghost King",
          content: `The rumours reached him before the ghost did.
  
  A red figure, they said. Moving through the mortal realm in ways that did not observe the usual divisions between the living and the dead, the human and the divine. Sightings in the south, then the north, then in places that shouldn't have been possible, a pattern of movement that seemed purposeful in a way that random spiritual activity wasn't. The heavenly officials had been monitoring it for months, which meant they'd been not-quite-saying-something to each other for months, the way heavenly officials did when they knew something that they felt was not quite their problem to handle.
  
  Xie Lian had been listening to the not-quite-saying for two weeks before someone finally said it out loud.
  
  "Crimson Rain Sought Flower," said Ling Wen, with the specific economy of someone reporting facts she'd rather not be reporting. "One of the Four Calamities. The Ghost King."
  
  He knew the name. Everyone knew the name — it was one of those names that had moved from rumour to legend to fact through sheer accumulation of evidence, a being who had existed for hundreds of years and whose precise nature and origins remained, despite significant effort, unclear.
  
  "He's in my jurisdiction?" Xie Lian asked.
  
  "The crossover of spiritual energy in the area suggests he may have taken an interest in something nearby."
  
  In something nearby. Ling Wen was, among other things, extremely good at saying things that communicated maximum information with minimum commitment. "An interest in me, you mean."
  
  "I could not speculate."
  
  "I appreciate the care." He thought about this. The Ghost King. One of the four most powerful supernatural entities in existence, with a reputation that ranged from apocalyptic to actively mythological depending on whose account you read. Not the kind of being whose interest in you was a comfortable thing to have. "I'll look into it."
  
  "Your Highness." Ling Wen's voice was carefully neutral. "You don't have to personally—"
  
  "I know." He stood. "But I'd like to."
  
  He found the ghost three days later, in a bamboo grove outside a small village, sitting on a rock and watching him approach with an expression of complete and unhurried attention. He was tall and dressed in red and his face was the most interesting thing Xie Lian had seen in several centuries, which was a thought he noted and filed without acting on.
  
  "Crown Prince," the ghost said. His voice was low and deliberate and contained, beneath its pleasantness, the specific quality of something very old that had decided to be peaceful as a choice rather than a default.
  
  "Ghost King," Xie Lian said.
  
  They looked at each other for a moment.
  
  "You're smaller than I expected," the ghost said.
  
  Xie Lian considered this. "I hear that often."
  
  Something shifted in the ghost's expression — subtle, a faint warming that he would only later learn to read correctly.
  
  "I've been watching you," the ghost said. "For a long time."
  
  "I know." Xie Lian met his eyes. "I've been wondering why."`,
        },
      ],
    },
  
    // ── 10. Eternally Regressing Knight ──────────────────────────────────────
    10: {
      chapters: [
        {
          title: "Chapter 1: The Loop",
          content: `Encrid had died nine hundred and forty-one times.
  
  He kept count out of professionalism rather than sentiment. The count was data, and data was useful, and the thirty-second version of himself had learned — expensively, over several iterations — that sentimentality about the count led to the kind of decision-making that produced iteration thirty-three ahead of schedule.
  
  This iteration had started, as they all started, at the moment of his original death. The goblin camp on the eastern border. The ambush he hadn't seen coming because he'd been too confident, too fast, too certain that his reputation preceded him enough to function as armour. He'd learned, by iteration twelve, to neutralise the camp in the first hour. By iteration forty, he'd learned to avoid it entirely and still accomplish the mission's objective. By iteration two hundred, he'd come to understand that the camp was not the problem he'd thought it was.
  
  The loop, as best he could work out, had a radius and a set of parameters, neither of which he fully understood. It reset on his death. It had reset nine hundred and forty-one times. The earliest version of himself had spent sixty iterations simply trying to survive and another forty trying to understand what was happening to him. The present version of himself — the nine hundred and forty-second — had moved past trying to understand the loop and was focused on the more tractable problem of how to use it.
  
  He stood at the edge of the goblin camp at dawn and did not draw his sword.
  
  "I know you're there," he said, in the dialect of the eastern goblin clans, which he'd learned during iteration four hundred and twelve from a captive who'd been surprised enough by his fluency to be genuinely informative.
  
  A pause from the treeline.
  
  "Human speaks our tongue," said a voice from the shadows. Surprised, but covering it.
  
  "Badly," Encrid agreed. "My accent is regional and approximately two hundred years out of date. I've been told it sounds like I'm reading from a very old scroll." He waited. "I'm not here to fight."
  
  "Then why come to our camp?"
  
  This was the part that varied by iteration. He had tried several approaches. The direct approach worked best, he'd found, with this particular tribe — they had a warrior culture that respected bluntness over negotiation.
  
  "I need to ask your chief something," he said. "About the ruins to the north."
  
  The shaman who'd sent the ambush appeared from the treeline. He was old — older than goblins usually got — with eyes that had the specific quality of someone who had seen enough to stop being surprised by most things.
  
  Those eyes looked at Encrid for a very long moment.
  
  "You have the smell of a man who has died before," the shaman said.
  
  Encrid went still.
  
  Nine hundred and forty-one iterations, and nobody had ever said that.
  
  "Yes," he said carefully. "Would you like to tell me what that means?"`,
        },
      ],
    },
  
    // ── 11. Grandmaster of Demonic Cultivation ────────────────────────────────
    11: {
      chapters: [
        {
          title: "Chapter 1: Rebirth",
          content: `Wei Wuxian died as he had lived: inconveniently, and in a way that caused significant administrative problems for everyone involved.
  
  The manner of it, he'd been told later, was a matter of some debate among historians. The facts, at least, were not disputed: the Yiling Patriarch, the most feared demonic cultivator of his age, had been destroyed on the summit of Burial Mounds by a mob large enough that the subsequent crowd management issues had lasted a week. The cause, depending on who you asked, was either justice, fear, or something that didn't have a clean name but that everyone who had been there seemed to understand.
  
  He had understood it too. That was the thing he thought about most, in the thirteen years of not-quite-existing that followed — that he'd understood, and that understanding had not been the comfort he might have expected.
  
  Then he woke up in someone else's body.
  
  The body was not in good condition. This was the first thing he established, through the kind of rapid physical inventory that became second nature after enough close calls. Bruising extensive. A rib, possibly two. The particular ache of long malnourishment. He was in a very small room with thin walls and the sound of a town outside and no memory, belonging to this body's original inhabitant, to orient himself with.
  
  The second thing he established was that the original inhabitant was gone — not dead, exactly, but gone, vacated, as if the soul had departed and left a vacancy. He'd heard of this. Never expected to be the occupant.
  
  The third thing was the paper on the floor beside him, which bore a request.
  
  He read it twice. Then he lay back and looked at the ceiling for a long time.
  
  The request was for a night hunt. Specifically, for whatever was causing the recent haunting of a village three days' travel east. Specific symptoms, specific location, specific offer of payment that the original body's owner had apparently already accepted before the situation became complicated.
  
  Wei Wuxian, who was dead, had been given a body, a job, and a very immediate problem.
  
  He sat up and looked for something to write with.`,
        },
        {
          title: "Chapter 2: Mo Village",
          content: `The village was called Mo Village, which told him immediately where he was — thirteen years could change a great deal, but geography was stable.
  
  He walked the three days in this body, learning it as he went. It moved differently than his own had. The cultivation was, he established within the first hour, nearly nonexistent — the man whose body this was had apparently had no training whatsoever, which was either a significant disadvantage or something he could work around. Wei Wuxian had spent his entire previous life being creative about disadvantages. He saw no reason to stop.
  
  The problem was flute.
  
  He'd built his whole cultivation method around sound — specifically, around the notes of his flute, Chenqing, which was somewhere in the Burial Mounds and probably not recoverable. Demonic cultivation without an instrument was manageable, technically, but it was like fighting with your dominant hand tied: possible, ugly, draining.
  
  He arrived at Mo Village in the late afternoon and spent an hour doing what he always did on arrival in an unfamiliar situation: watching, listening, letting the place tell him what it was.
  
  It told him: fear. Old fear, the kind that had settled in and become part of the furniture, accepted as normal rather than alarming. The kind of fear that meant whatever was causing the haunting had been around for years, not months.
  
  The village head, a man whose name turned out to be Mo Ziyuan, received him in the main hall with the specific gratitude of someone who had given up hope and was not quite believing its return.
  
  "It's worst near the old ancestral hall," Mo Ziyuan said. "Three people have disappeared. My son saw something in the east field last week. My wife—" He stopped. Started again. "We need it to stop."
  
  Wei Wuxian looked at the map he'd been handed. The configuration of the resentful energy — he could feel it, faintly, even with this body's minimal cultivation, the way you could feel weather in an old injury — was consistent with something that had been building for a long time around a central point.
  
  "Something's buried," he said.
  
  Mo Ziyuan looked at him. "What?"
  
  "Under the ancestral hall. Something with resentment attached to it — old resentment, probably predating the village. The symptoms you've described are what happens when that kind of energy starts to seep into the surrounding area." He folded the map. "I need to go look at the hall."
  
  "It's dangerous after dark."
  
  Wei Wuxian had died once already. The calculus of danger had reorganised itself somewhat.
  
  "I know," he said pleasantly. "I'll go now, before dark." He paused. "Do you have a flute I could borrow?"`,
        },
      ],
    },
  
    // ── 12. Apocalypse Diaries ────────────────────────────────────────────────
    12: {
      chapters: [
        {
          title: "Chapter 1: Day One",
          content: `The last normal day was a Thursday.
  
  Park Joohee had been running late — a meeting that ran long, then the escalator at the subway station broken, then the particular Thursday-afternoon quality of Seoul traffic that made you feel the city was doing it personally. She'd been thinking about what to make for dinner and whether she had enough ginger when the lights went out.
  
  Not the lights in the subway station. The lights everywhere.
  
  It had taken her a moment, in the subsequent dark and the sudden stillness of the stopped train, to understand that 'everywhere' meant more than a circuit. The backup systems didn't kick in. The emergency lighting didn't kick in. The phones — and she'd reached for hers immediately — showed no signal, no network, nothing but the local clock still counting on a dead face.
  
  Silence, in a subway car that had been full of sound thirty seconds ago.
  
  Then: a sound that was not a sound, exactly, but that she felt in the part of the nervous system that predated language, the ancient part that had been designed specifically for the purpose of saying run.
  
  She had been an ER nurse for six years. She had learned, over six years, to override the run response until she'd had time to assess.
  
  She assessed in four seconds. Then she started moving toward the emergency door at the front of the car, because the emergency door was closer to the surface and the surface was closer to outside, and outside was, in this moment, better than inside by every measure she could construct.
  
  "Hey." A hand caught her arm. "Do you know what—"
  
  "No," she said, not stopping. "I'm going outside. Come with me or don't."
  
  Three people came with her. Two of them she would still know by name two years later. The other would not survive the first week, through no fault of her own, which was one of the early and brutal lessons the world provided: survival had less to do with character than people wanted to believe.
  
  She reached the surface in four minutes.
  
  The sky above Seoul was wrong. Not dark — it was mid-afternoon, the light was still there — but wrong in a way she didn't have the vocabulary for. The buildings were intact. The streets were intact. But the people who'd been outside had stopped, mid-motion, and were looking up with the particular stillness of beings receiving information that was reorganising everything they knew.
  
  And above the city, in the sky where there was nothing at 3pm on a Thursday, something like a gate had opened.`,
        },
      ],
    },
  
    // ── 13. Yona of the Dawn ──────────────────────────────────────────────────
    13: {
      chapters: [
        {
          title: "Chapter 1: The Princess",
          content: `The princess of Kouka was, by the universal agreement of everyone who had to deal with her, an extremely demanding person to protect.
  
  Not maliciously demanding — Son Hak was careful to be precise about this in his own thinking, because imprecision led to conclusions he didn't want to reach. She wasn't cruel, wasn't callous, wasn't the kind of royal who inflicted difficulty as an expression of power. She was simply, comprehensively, unable to perceive consequences that weren't immediately in front of her, which in a fifteen-year-old who had never once left the palace grounds produced its own specific variety of professional hazard.
  
  "Lady Yona," he said, watching her attempt to climb the palace garden wall. "What are you doing."
  
  "I want to see the east market." She had made it to the second stone and was seriously evaluating her prospects for the third. Her red hair was tied back with characteristic inattention, half of it already escaping. "Hak. Have you ever been to the east market?"
  
  "Yes. You've asked me about it seventeen times."
  
  "Then you understand why I need to see it."
  
  "I understand that you've decided you need to see it." He watched her reach the third stone and begin to wobble. "You're going to fall."
  
  "I'm not going to—" She fell. He caught her with the long-practised ease of someone who had been catching her for ten years, one arm out, barely breaking his own stillness. She righted herself in his arms with the complete lack of embarrassment of someone who had never had the option of learning embarrassment in this particular context. "I would have caught myself."
  
  "Mm."
  
  "I would have."
  
  "Lady Yona." He set her down on the garden path. "The King has said—"
  
  "I know what Father has said." Her voice shifted slightly — the small, controlled change that meant she was navigating something she felt strongly about and had decided not to feel strongly about visibly. "I'm not asking to go to war. I just want to see the market."
  
  Hak looked at her. He had been assigned to her as a bodyguard at age eight and she'd been five, and in the ten years since he'd developed a fairly complete map of the ways she thought and the ways she didn't. The market was a symptom. The real thing was larger.
  
  "You want to see the kingdom," he said.
  
  She was quiet for a moment. "Is that strange?"
  
  "No." He turned and began walking back toward the palace. "It's the first sensible thing you've wanted in weeks."
  
  She followed him, which she always did, eventually. "Does that mean you'll help me?"
  
  "It means I'll think about it."
  
  Behind him, he heard the small, involuntary sound she made when she was trying not to show that something had gone better than she'd expected.
  
  He didn't smile. He was very disciplined about that.`,
        },
      ],
    },
  
    // ── 14. Horimiya ─────────────────────────────────────────────────────────
    14: {
      chapters: [
        {
          title: "Chapter 1: Hori-san and Miyamura-kun",
          content: `Hori Kyouko's secret was not, she felt, a very interesting secret.
  
  She was popular at school. She was efficient, and bright, and knew how to be in a room in a way that made people comfortable, and she'd been doing it long enough that it was essentially just who she was when she was there. She had friends, and a reputation, and a carefully maintained version of herself that she wore like a second uniform.
  
  At home, she was someone else.
  
  Not a different person, exactly. More like the same person with the performance turned off — hair down, no makeup, an apron, her little brother Souta demanding attention in the ongoing and apparently unending way of small children, dinner to make because their parents were working late again. She was seventeen and had been running a household in the margins of her actual life for three years, and she was, mostly, fine with this. It was just the shape of her life. She'd stopped expecting anything different.
  
  The problem with the secret was that keeping it required staying out of the way of school friends, which was usually easy because school friends didn't generally visit her part of the city, which was why she'd answered the door on a Sunday afternoon without checking first.
  
  The boy on the other side of the door was not someone she'd expected.
  
  Miyamura Izumi was, at school, considered gloomy and unfriendly in the specific, uninteresting way of someone who simply hadn't figured out how to translate their interior into something legible. He wore his hair down over his face. He spoke quietly when he spoke. He sat alone, mostly, and the rumour — the usual rumour for that type — was that he was delinquent under it, because people needed narratives and delinquent was available.
  
  He was currently standing at her door with a small cut above his eye and a politely puzzled expression, holding her brother's shoe.
  
  "Souta ran ahead," he said. "He dropped this."
  
  Horimiya looked at the shoe. Then at Miyamura. Then at the short sleeves of his jacket, which he was wearing because it was summer, and the tattoos that covered both his arms from wrist to shoulder.
  
  "...come in," she said.
  
  She watched him absorb the apron, the untied hair, the faint smell of cooking, the complete contrast between the person in front of him and the person he knew from school.
  
  He looked, but not in the invasive way — in the careful way of someone who understood that he'd seen something he wasn't supposed to and was working out the appropriate response.
  
  "I won't tell anyone," he said.
  
  She looked at him. At the tattoos, and the piercings she could see now, and the earrings she'd never seen at school because they were hidden under his hair.
  
  "I won't either," she said.
  
  A pause that was, strangely, comfortable.
  
  "Do you want to stay for dinner?" she said.`,
        },
      ],
    },
  
    // ── 15. Kill the Villainess ───────────────────────────────────────────────
    15: {
      chapters: [
        {
          title: "Chapter 1: The Villainess",
          content: `The first thing she established, upon waking up in Eris Miserian's body, was that the situation was worse than it appeared.
  
  This was a high bar, given that the situation appeared to involve being the designated villain of a romance novel she'd read on her commute six months ago. She remembered the broad outlines: aristocratic family, imperial court, a saintly heroine named Antinora whose goodness was sufficiently radiant to solve most narrative problems, and a series of obstacles that included Eris — proud, cruel, entitled, in love with the Crown Prince in the specific way of characters whose love was a mechanism for demonstrating the heroine's superiority.
  
  The novel had ended with Eris's execution. A public one. The kind the author had described with the specific satisfaction of someone delivering narrative justice.
  
  She sat up in a bed that was very large and very cold and took stock.
  
  The room was excessively ornate. This was the room of someone who had grown up with resources she'd never had to think about — gilded mirrors and silk hangings and a dressing table covered in things she didn't know the names of. The body she was in was sixteen, she estimated, and beautiful in the specific, polished way of wealthy girls raised to be beautiful, and currently very pale.
  
  Eris Miserian. She turned the name over in her mind. In the novel, this was the antagonist — the obstacle the heroine overcame, the cautionary tale, the face of what happened when privilege became cruelty. The character who existed, narratively, to lose.
  
  She had absolutely no intention of playing that role.
  
  The maid who came in at dawn found the young mistress sitting upright in bed, looking at nothing, with an expression the maid would later describe — in a whisper, to the other maids, over the course of several weeks — as someone doing very complicated mathematics.
  
  "My lady? Are you—"
  
  "Tell me," said the person who was not really Eris Miserian, in a voice she was already calibrating for the role, "what day it is."
  
  The maid told her.
  
  She exhaled slowly. The novel's timeline — she tried to remember. The Crown Prince's betrothal announcement had been the inciting incident, and that was...
  
  Six weeks away.
  
  She had six weeks before the narrative machinery started moving.
  
  "And the Crown Prince," she said carefully. "What is his current itinerary?"
  
  The maid blinked. "His Highness is attending the spring council, my lady. He is expected to return to the capital in—"
  
  "Six weeks?"
  
  "...approximately, my lady."
  
  She looked at the gilded ceiling. She thought about the execution scene, which she remembered in more detail than she'd like. She thought about what she knew about this world and what she'd have to work with.
  
  She thought: I didn't read three hundred chapters of this thing for nothing.
  
  "Bring me paper," she said. "And something to eat. I have planning to do."`,
        },
      ],
    },
  
  };