# Connect Product Vision

## Document Purpose

This document defines a product direction for Connect that can give people a clear reason to install the app and a recurring reason to keep using it.

The proposed direction is to evolve Connect from a contact browser into a private relationship-maintenance assistant. The app should help people remember who matters, know when a relationship needs attention, and act on that reminder with as little friction as possible.

This document covers the product from initial positioning through MVP delivery, growth, monetization, privacy, technical implications, measurement, and future expansion.

## Product Thesis

> Your phone remembers numbers. Connect helps you remember people.

Contact apps are usually passive databases. They store names, phone numbers, email addresses, and birthdays, but they do little to help someone maintain a relationship over time.

Connect should solve that missing layer. It should help users:

- Decide which relationships they want to protect.
- Remember when it is time to reconnect.
- Recall useful personal context before reaching out.
- Contact someone without navigating through multiple screens.
- Build a sustainable habit of maintaining important relationships.

The product should be personal rather than corporate, supportive rather than guilt-inducing, and private by default.

## The User Problem

People rarely lose relationships because they consciously choose to. Relationships often fade because daily life becomes busy, a person moves away, or neither side remembers to initiate the next conversation.

Existing tools only partially solve this problem:

- Contact apps store information but do not create a relationship-maintenance habit.
- Calendars can create reminders but lack the person's history and context.
- Task managers make relationships feel like chores.
- Social networks promote passive consumption rather than meaningful connection.
- Business CRMs are too complex and transactional for friends and family.
- Birthday reminders usually prompt contact only once a year.

The core job to be done is:

> Help me stay meaningfully connected to people I care about, even when life gets busy.

## Target Audience

Connect should not initially target everyone who has contacts. A narrow audience will make its message, onboarding, and feature decisions clearer.

### Recommended initial audience

People who have moved away from family, friends, or an established community and do not want those relationships to fade.

This audience can include:

- Students living away from home.
- People who relocated to another city or country.
- Immigrants and members of distributed families.
- Remote workers.
- People whose close friends now live in different locations.

Their problem is emotional, recurring, and easy to explain. They already have the people in their contact list; they need help maintaining the relationships.

### Possible later audiences

Once the personal use case is working, the same underlying system could support:

- Freelancers maintaining client relationships.
- Founders and professional networkers.
- Recruiters and community organizers.
- Mentors and mentees.
- Caregivers coordinating family connections.

The initial product should avoid language such as leads, pipelines, deals, or accounts. Those concepts would make the experience feel like a sales CRM.

## Positioning

### Product category

Private relationship companion or personal keep-in-touch assistant.

### Product promise

Connect gives users a calm, manageable list of people worth contacting today and preserves the context needed to make each interaction meaningful.

### Differentiators

- Personal relationships first, rather than sales relationships.
- Local-first and privacy-conscious behavior.
- A small, actionable People Inbox instead of a large contact database.
- Gentle reminders based on a cadence chosen by the user.
- Lightweight private notes and relationship history.
- Fast actions through the communication apps users already use.
- No social feed, follower count, or public relationship scoring.

## The Two-Engine Product Model

Connect needs both an acquisition engine and a retention engine.

### Acquisition engine: Contact Health Check

The Contact Health Check gives users immediate value after installation. It analyzes device contacts and presents safe, understandable suggestions.

Potential checks include:

- Duplicate contact candidates.
- Contacts with incomplete or unclear names.
- Important contacts without photos.
- Important contacts without birthdays or other significant dates.
- Contacts missing a useful phone number or email address.
- Contacts that have not been assigned to a meaningful circle in Connect.
- Potentially outdated or low-quality entries that the user may want to review.

The health check should never automatically modify or delete contacts. It should explain each suggestion and require explicit confirmation for any device-contact mutation.

Contact cleanup is an acquisition feature rather than the final product. Google Contacts already offers [duplicate merging](https://support.google.com/contacts/answer/7078226) and supports [birthdays, anniversaries, and custom significant dates](https://support.google.com/contacts/answer/12732221). Connect must therefore use organization and cleanup to introduce users to the deeper relationship-maintenance experience.

### Retention engine: People Inbox

The People Inbox is the recurring reason to return. It answers one question:

> Who should I connect with today?

Instead of presenting the full address book, it presents a small queue of meaningful actions. A person in the queue might appear as follows:

> Ananya — time to reconnect  
> Last connected: 6 weeks ago  
> Note: Started a new job in Bangalore  
> Actions: Call · Message · Remind tomorrow

The inbox should remain intentionally small and calm. Its purpose is to produce action, not infinite browsing.

## Core Product Loop

The initial recurring loop should be:

1. The user selects 5–10 people they do not want to lose touch with.
2. The user places them in circles such as Family, Close Friends, or Mentors.
3. The user chooses a relationship cadence for each person or circle.
4. Connect schedules the next check-in and displays it in the People Inbox when due.
5. The user calls, messages, or opens another supported communication channel.
6. Connect asks whether the user connected.
7. The user optionally adds a short private note.
8. Connect calculates or schedules the next check-in.
9. The user receives a useful reminder at the appropriate time and repeats the loop.

This creates a recurring benefit without requiring the user to replace their phone, messaging, or contacts applications.

## Product Principles

### Relationships are not tasks

The app should help users act without making people feel like checklist items. Copy should be warm and optional rather than demanding.

Prefer:

- Time to reconnect.
- You may want to check in this week.
- Remind me later.

Avoid:

- Overdue by 12 days.
- You failed your relationship goal.
- Complete this contact.

### Gentle status instead of judgment

A simple relationship status can help users scan the inbox:

- Connected.
- Due soon.
- Time to reconnect.

Avoid competitive leaderboards, relationship scores visible to other people, and streak mechanics that punish users for missing a day.

### Privacy is part of the product

Contacts and relationship notes are highly sensitive. Connect should collect the minimum data necessary, make data handling understandable, and keep data on the device whenever practical.

### The user remains in control

The app should suggest, not silently modify. Users must control:

- Who is added to Connect.
- Reminder frequency.
- Contact changes.
- Notification timing.
- Whether optional sync or AI features are enabled.

### Value before account creation

The first version should provide its core local experience without requiring an account. Account creation should be introduced only when the user requests a feature that requires it, such as encrypted multi-device sync.

## MVP Scope

The MVP should prove that users will create relationship plans, act on reminders, and return to maintain them.

### 1. Important People and Circles

Users can select contacts and organize them into circles such as:

- Family.
- Close Friends.
- Friends.
- Mentors.
- People to Reconnect With.
- A custom circle created by the user.

A contact may belong to more than one circle if the data model supports it without adding confusing UI.

### 2. Relationship Cadence

Users can choose how often they would like to reconnect:

- Weekly.
- Every two weeks.
- Monthly.
- Every three months.
- Custom interval.
- A specific one-time date.

The app should suggest sensible defaults but never assume that every relationship needs the same cadence.

### 3. People Inbox

The inbox should display:

- People due today.
- People due soon.
- Recently missed reminders that still require a decision.
- Important upcoming dates where advance preparation would be useful.

Each item should offer quick actions:

- Call.
- Send a message.
- Open a supported messaging app.
- Mark as connected.
- Remind later.
- View notes and history.

### 4. Private Notes and Timeline

Users can add a short note after or before a conversation. Examples include:

- Started a new job.
- Interview is next Friday.
- Moving in September.
- Ask about their mother's health.

The contact detail experience should show a lightweight timeline containing:

- Completed check-ins.
- User-created notes.
- Rescheduled reminders.
- Important dates.

The timeline should not claim that a phone call or message occurred unless the user confirms it or the platform provides reliable, permission-compliant evidence.

### 5. Local Notifications

Notifications should be useful and restrained. Users should be able to configure:

- Preferred days and times.
- Daily or weekly reminder grouping.
- Whether individual reminders are allowed.
- Quiet periods.

A grouped notification such as “Three people you may want to reconnect with this week” may feel less intrusive than separate notifications for every contact.

### 6. One-Tap Communication Actions

Connect should use the communication tools already available on the device. The first version can support actions such as calling, SMS, email, and messaging-app deep links where dependable.

Launching an external app should be treated as an attempt, not proof of a completed interaction. Connect can ask the user to confirm when they return.

## Onboarding Experience

The user should reach the first meaningful result in approximately one minute.

### Suggested onboarding flow

1. Explain the benefit before requesting contact permission.
2. Request contact access with clear privacy language.
3. Ask the user to choose five people they never want to lose touch with.
4. Ask how often they would ideally connect with those people.
5. Show the first People Inbox.
6. Request notification permission only after the user creates a reminder and understands its value.

The onboarding experience should not require users to organize their entire address book.

### Activation event

A user is considered activated when they:

- Select at least five important people.
- Create at least one reminder cadence.
- Complete or schedule their first connection action.

## Key Screens

### Today

The default recurring destination. It contains the People Inbox, due reminders, important upcoming moments, and quick actions.

### People

The existing contacts experience, expanded with relationship status and circle membership. It remains searchable and should continue to use device contacts as its source of truth.

### Person Details

The existing contact details plus:

- Relationship cadence.
- Next reminder.
- Circle membership.
- Private notes.
- Connection timeline.
- Quick communication actions.

### Circles

A simple way to browse and configure groups of important people. Circle-level cadence may be introduced after per-person cadence is proven.

### Contact Health

An on-demand report containing contact organization and cleanup suggestions. It should clearly separate informational findings from actions that modify device data.

### Profile and Settings

Settings for theme, notifications, privacy, data export, optional sync, and account management when accounts are eventually introduced.

## Existing Features and Their Future Role

### Contacts

Contacts remain the searchable source directory. They are not the primary retained experience; they support selection, discovery, and communication.

### Favorites

Favorites can become the first form of Important People. Existing favorite IDs can seed onboarding and reduce migration work.

Over time, Favorites may be renamed or expanded into Important People or Circles. A migration should preserve users' existing selections.

### Profile

Profile becomes the location for notification preferences, privacy controls, data export, optional encrypted sync, and subscription settings.

## Technical Direction

The current architecture already provides a suitable base for the MVP.

### Device contacts

TanStack Query should remain the in-memory source for device-contact collection and detail data. Contact queries can continue to refresh when the app returns to the foreground or when the operating system reports contact changes.

Full contact records should not be duplicated into persistent application state.

### Durable relationship metadata

Zustand with MMKV persistence can store small pieces of application-owned metadata that must survive app launches, such as:

- Contact ID.
- Circle IDs.
- Reminder cadence.
- Last user-confirmed connection date.
- Next reminder date.
- Private notes.
- Reminder state.

The model must tolerate a device contact being deleted, merged, or receiving a new identifier. The app should preserve recoverable relationship metadata where possible and clearly surface unmatched records for user review.

### Illustrative domain model

The exact names can change during implementation, but the model will likely need concepts similar to:

```ts
type RelationshipPlan = {
  contactId: string;
  circleIds: string[];
  cadence: RelationshipCadence;
  lastConnectedAt?: string;
  nextReminderAt?: string;
  reminderEnabled: boolean;
};

type RelationshipNote = {
  id: string;
  contactId: string;
  text: string;
  createdAt: string;
};

type ConnectionEvent = {
  id: string;
  contactId: string;
  occurredAt: string;
  source: 'user-confirmed' | 'manual';
  channel?: 'call' | 'sms' | 'email' | 'other';
};
```

Implementation should follow the repository's established type, service, store, and feature-folder conventions rather than treating this illustrative model as a final schema.

### Notifications

Local notifications should be sufficient for the first version. Notification scheduling should be implemented through a focused service rather than directly inside screens.

The app must correctly reschedule notifications when:

- A cadence changes.
- A connection is marked complete.
- A reminder is postponed.
- A relationship plan is disabled or deleted.
- Notification permissions change.

### Backend requirements

The MVP should not require a backend. A backend becomes relevant for:

- Encrypted multi-device sync.
- Account recovery.
- Shared circles.
- Cross-device subscriptions.
- Server-hosted AI processing, if users explicitly enable it.

Avoid introducing backend complexity before local retention is demonstrated.

## Privacy and Trust

Connect will handle some of the most sensitive information on a user's phone. Privacy communication must be specific rather than relying on a generic promise.

### MVP privacy commitments

- Do not upload the address book.
- Store relationship metadata locally.
- Do not sell contact or relationship data.
- Do not silently modify contacts.
- Request permissions only when their value is clear.
- Provide deletion and export controls for Connect-owned data.
- Explain the difference between device contacts and Connect's private metadata.

### Optional future cloud features

Cloud sync should be opt-in and designed around end-to-end encryption where feasible. Users should understand what is synchronized, what remains local, and what cannot be recovered if encryption keys are lost.

AI features should not send contact notes to a remote model without explicit consent and a clear explanation. Local processing should be preferred when practical.

## Future Intelligence Features

AI can reduce effort after the core product loop works. It should assist the user rather than become a generic chat screen.

Useful future capabilities include:

- Convert a note into a reminder: “Ravi's interview is Friday” becomes a Thursday follow-up reminder.
- Suggest a conversation opener from the user's own private notes.
- Convert a short voice note into structured notes and dates.
- Summarize a long personal timeline before a call.
- Detect potentially important dates mentioned in notes and ask whether to save them.
- Suggest a more appropriate cadence based on user behavior, subject to confirmation.

AI output must remain editable, and no inferred personal fact should silently become permanent data.

## Growth Strategy

### App-store acquisition themes

Potential positioning experiments include:

- Keep-in-touch reminder.
- Relationship reminder.
- Personal relationship manager.
- Remember birthdays and important moments.
- Organize important contacts.
- Private personal CRM.

These are hypotheses to test through store-listing experiments and keyword research rather than fixed claims about search demand.

### First-session value

The Contact Health Check and five-person onboarding should demonstrate value before the user is asked to subscribe, create an account, or organize more contacts.

### Organic growth

Possible later growth loops include:

- Invite a family member to a consent-based shared circle.
- Share a relationship reminder template without sharing any contact data.
- Gift a premium subscription to someone moving away.
- Share a privacy-safe weekly achievement such as reconnecting with several important people.

Growth mechanics must never expose names, notes, contact details, or relationship status without explicit user action.

### Content and storytelling

Marketing should focus on the human problem rather than contact management:

- Staying close after moving abroad.
- Remembering to call parents and grandparents.
- Maintaining friendships after college.
- Being present for important moments.
- Rebuilding a network after changing cities or careers.

## Monetization

Monetization should follow demonstrated value rather than block the first useful experience.

### Possible free plan

- A limited number of active relationship plans.
- Core People Inbox.
- Local reminders.
- Basic notes and circles.
- Contact Health Check.

### Possible paid plan

- Unlimited relationship plans and notes.
- Advanced reminder rules.
- Encrypted backup and multi-device sync.
- Richer timeline and history.
- AI-assisted note and reminder creation.
- Custom notification schedules.
- Shared circles when available.

A simple annual subscription is likely easier to understand than usage-based pricing. Pricing should be tested only after measuring whether the People Inbox creates recurring value.

## Success Metrics

### North-star metric

Meaningful connections completed per active user per week.

This measures the outcome Connect promises rather than screen views or time spent in the app.

### Acquisition metrics

- Store-page conversion rate.
- Cost per install by campaign and audience.
- Contact-permission acceptance rate.
- Percentage of new users who begin the five-person onboarding.

### Activation metrics

- Percentage selecting at least five important people.
- Percentage creating a reminder cadence.
- Time to first scheduled connection.
- Percentage completing or rescheduling the first People Inbox item.

### Retention metrics

- Day 1, Day 7, and Day 30 retention.
- Weekly active users.
- Weekly People Inbox completion rate.
- Average active relationship plans per retained user.
- Reminder open and action rates.
- Percentage of users adding a note after a connection.

### Quality and trust metrics

- Notification disable rate.
- Contact-permission denial and revocation rates.
- Reminder snooze and dismissal rates.
- Contact mutation failure rate.
- Data deletion and export completion rate.
- User reports related to privacy or incorrect contact suggestions.

Time spent in the app should not be a primary goal. A short session that helps someone call a family member is a successful session.

## Delivery Roadmap

### Phase 0: Discovery and validation

Before building the complete experience:

- Interview people who live away from family and old friends.
- Ask how they currently remember to reconnect.
- Test the phrase “People Inbox” and alternative descriptions.
- Prototype selecting five people and choosing a cadence.
- Validate whether users are comfortable storing private notes.
- Determine which communication actions matter most by target market.

Success means users recognize the problem, can name people they want help remembering, and express willingness to receive reminders.

### Phase 1: Core local MVP

Build:

- Important People selection.
- Per-person cadence.
- People Inbox.
- Local notifications.
- Mark as connected.
- Remind later.
- Quick call and message actions.
- Private notes.
- Basic relationship timeline.

Do not add accounts, cloud sync, or AI in this phase.

Success means activated users repeatedly complete connection actions and demonstrate meaningful early retention.

### Phase 2: Organization and acquisition

Add:

- Circles.
- Contact Health Check.
- Important dates and advance reminders.
- Improved notification grouping and scheduling.
- Weekly relationship recap.
- Better onboarding personalization.

Success means the app has both a compelling first-session benefit and a recurring weekly habit.

### Phase 3: Intelligence

Add carefully tested, opt-in assistance:

- Natural-language reminder creation.
- Voice-note capture.
- Suggested conversation openers.
- Note-to-date extraction.
- Cadence suggestions.

Success means these capabilities increase completed connections or reduce setup effort without reducing trust.

### Phase 4: Sync and collaboration

Consider:

- Optional accounts.
- Encrypted backup and multi-device sync.
- Shared family circles with consent.
- Subscription expansion.

This phase should proceed only after privacy, recovery, and ownership rules are well defined.

## Features Not to Build First

### Spam caller identification and blocking

This requires large datasets, continuous infrastructure, platform-specific integration, and a strong network effect. Truecaller already reports a user base of more than [500 million people](https://www.truecaller.com/spam-blocking). Competing directly would distract from Connect's more differentiated relationship problem.

### A generic social network

A feed, follower model, or chat system introduces cold-start and moderation problems while duplicating tools users already have.

### Contact cleanup as the complete product

Cleanup can attract installs, but most users need it occasionally. It does not naturally create a weekly habit.

### A full professional CRM

Business-card scanning, deals, pipelines, and sales tracking would compete with mature products and weaken the personal positioning. Personal CRM products such as [Covve](https://covve.com/personal-crm) already combine reminders, notes, interaction history, and networking features.

### AI chat as the primary interface

A generic assistant does not solve the relationship-maintenance loop by itself. AI should make reminders and notes easier after the core behavior is established.

### Mandatory cloud accounts

Requiring registration before users can experience local value adds friction and creates an unnecessary trust barrier.

## Risks and Mitigations

### Notifications become annoying

Mitigation:

- Start with a small number of important people.
- Group notifications.
- Offer easy snooze and cadence controls.
- Learn from dismissals without silently changing settings.

### Relationships feel transactional

Mitigation:

- Use warm language.
- Avoid productivity-style overdue indicators.
- Let users record meaningful context, not only completion events.
- Avoid public scoring and competitive mechanics.

### Users do not trust contact access

Mitigation:

- Explain the benefit before permission is requested.
- Make local-only behavior visible.
- Avoid requiring account creation.
- Publish a clear privacy policy and in-app data controls.

### Device contact identifiers change

Mitigation:

- Keep application metadata separate from full contact records.
- Detect unmatched relationship records.
- Let users reconnect an unmatched record to a device contact.
- Design for deletion and merge events from the beginning.

### Manual interaction confirmation creates friction

Mitigation:

- Make confirmation a single tap.
- Ask after the user returns from the communication app.
- Allow users to disable confirmation prompts.
- Do not falsely imply automatic call or message tracking.

### The product is useful but not urgent

Mitigation:

- Focus on users experiencing relocation or life transitions.
- Demonstrate value with five specific people during onboarding.
- Use important dates and contextual reminders to create timely reasons to act.

## Product Validation Questions

The following questions should be answered through interviews, prototypes, and early analytics:

- Do people want reminders for personal relationships, or do they perceive them as unnatural?
- Which cadence choices feel useful without requiring too much setup?
- Is “People Inbox” understandable, or is another term clearer?
- Do users prefer individual reminders or a weekly digest?
- Will users add private notes, and what privacy explanation do they need?
- Which quick actions are most important: calls, SMS, WhatsApp, email, or something else?
- Does the Contact Health Check materially improve installation conversion?
- What number of active relationship plans provides enough free value while supporting a paid tier?
- Does completing reminders correlate with Day 30 retention?

## Recommended First Product Experiment

The first experiment should be intentionally small:

1. Add an onboarding prompt to select five important contacts.
2. Let users choose a monthly or custom reconnect cadence.
3. Add a simple Today queue.
4. Send local reminders.
5. Offer Call, Message, Connected, and Remind Later actions.
6. Measure whether users return and complete another connection within four weeks.

This experiment tests the central product thesis without requiring circles, AI, cloud infrastructure, or a comprehensive contact-cleanup engine.

If users create plans but ignore the queue, improve reminder timing and the action experience before expanding scope. If users repeatedly complete connection actions, proceed with notes, circles, health checks, and advanced personalization.

## Final Recommendation

Connect should become a private, local-first relationship companion.

The Contact Health Check should earn the initial download by providing immediate organization value. The People Inbox should earn retention by helping users reconnect with people who matter. Private notes, gentle reminders, and one-tap communication should make those interactions more meaningful without attempting to replace the user's existing contact or messaging applications.

The first release should remain small and local. It should prove one outcome:

> Connect helped the user reach someone they care about who they otherwise might have forgotten to contact.

If the product can produce that outcome consistently, it has a credible reason to be installed, retained, recommended, and eventually paid for.
