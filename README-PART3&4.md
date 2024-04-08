> ### Part 3: Enhanced User Management and Wallet Verification
__________________________________________________________________________________________________________________________
**Objective:**

Develop a comprehensive web application that extends the functionalities from Parts 1 and 2, incorporating enhanced user management features, wallet verification mechanisms, and an admin control panel.

**User Requirements:**
- Prototype Link: 🎨 [UI Design Files](https://)  
- Mobile View Link: Mobile View Link 
- Desktop View Link: Desktop View Link


**Lightning Address Verification:**
- During sign up, the application will verify if the username is an active Lightning Address. Non-active Lightning Addresses should not be allowed to sign up. 
*(example of non-active LN Address https://docs.google.com/document/d/1ZvfVuuY1mpB_ct7O8dDYe_SPzoy2vMWICGuI1TKhl58/edit?usp=sharing)*
- Implement a feature for users to verify their LN username in the settings (using the lightning Forgot Password flow for the same process)
Link
- Accounts of users who haven't verified their Lightning Address within 24 hours will be automatically deleted
Unlock the ordinal wallet setting on the home screen upon successful Lightning Address verification, as directed by the provided Figma designs. **(Check below Ordinal Wallet Verification for details of process)**
- Remove Earn Sats icon from the home screen for now as directed by the Figma **(Update)**
- Update Welcome Screen sign-up buttons 

**Ordinal Wallet Verification:**
- Implement a feature for users to verify ownership of their ordinal wallet on chain using 1 confirmation as directed by the provided Figma designs
- This verification should be available only after users have verified their Lightning Address as directed in Part 3
After verification, users should be able to see the current ordinals under the given wallet address, a refresh button to review the ordinals under the given address again, and a disconnect wallet button


**Admin Requirements:**
- Prototype Link: Admin UI Design File
- Mobile View Link: Mobile Admin
- Desktop View Link: Desktop Admin
- Develop functionality in the admin panel allowing administrators to:

**Log In:**
- Create Log-In Screen for the Admin to enter the Admin Dashboard
- Add OTP sent to the Admin’s email when signing in
- Add OTP when using Forgot Password
- Upon the Admin signing in for the first time, the Admin is prompted to change and reset their password
- See Icons as per Figma

**Ordinal Collection Management:**
- Create and delete Ordinal Collections
- Search for an Ordinal via wallet address or Ordinal ID
- Add Ordinals from the search results to collections as directed by the provided Figma designs *Relevant links: https://docs.hiro.so/ordinals-explorer*
- Click on the 3 dots and then modify in order to remove an Ordinals from the collection
- Create a separate test site for administrators to perform any developed abilities

**Timeline:**
- Development Period: Starting April 8, 2024
- Submission Deadline:  April 29, 2024 (anytime before the general deadline of April 29 is also acceptable)
- Evaluation Period: Until May 3, 2024
- Winner Announcement: May 6, 2024

**Prizes:**
- 1st Place: 1,000,000 SATs
- Runner Up: 500,000 SATs

**Submission Guidelines:**
- Submit here: (Submission link)
- When submitting the project, please ensure to provide a direct URL link to the live version hosted on a website (e.g., exampledemo.liveproject.com)
- Provide documentation on the used methodologies, libraries, and implemented security measures
- Include both mobile and desktop views in the application and ensure responsiveness across both views
- Upload the code and steps 1-4 to our GitHub repository: (UploadLink ).
- Ensure that the implemented functionalities are thoroughly documented, while providing clear instructions for users to verify ownership of their Ordinal Wallet and for administrators to manage Ordinal collections via the Admin panel

**Note:** Participating in this competition implies acknowledgment that winning codes will be shared as open source on The MAS Network's GitHub. This allows future developers to build upon them. TFurthermore, the MAS Network has the right to reward projects on its own discretion. Contact sales@themasnetwork.com for clarifications or join our discord channel *https://discord.com/invite/UeNA5yXAug*.

_________________________________________________________________________________________________________________________
> ### Part 4: Active Collection Management and Tipping System

**Objective:**
Develop streamlined admin controls for activating and managing collections, facilitating Lightning Address-based tipping within collections. Add the ability for users to access a dynamic leaderboard showcasing top earners weekly and all-time.

**Admin Section:**
- Prototype Link: Admin UI Design File
- Mobile View Link: Tipping Feature UI
- Desktop View Link: Tipping Desktop View UI

**Activate Collection:**
- Activating collection and then allowing the admin to search for lightning addresses in a collection to see what Lightning Address owns what Ordinal form the collection
- When making a inactive collection active, then that collection moves from inactive to active
- Active collections can be made inactive by clicking on the three dots at the top right of the collection
- Active collections can not be edited until you make the collection inactive (for clarity on collections, contact the Admins in the Discord)

**Active Collection Tipping Functionality:**
- In active collections, the Admin should be able to tip all verified owners of the ordinals in that collection via their Lightning Address.
- After searching a verified Lightning Address within one collection, the Admin should be able to tip Lightning Addresses individually as long as they own an Ordinal in that collection.
- When tipping a community, sats are evenly divided among users based on how many ordinals they own from that collection and recorded in the history tab as per Figma.
- When tipping a user, sats are paid out via Lightning and recorded in the history tab as per Figma.
When tipping a community/individual, the ability to switch payment denomination between sats, BTC, and USD via Lightning is available

**User Section:**
- Prototype Link: UI Design Files
- Mobile View Link: UI Screen Design
- Desktop View Link: Desktop UI Screen Design

**Leaderboard:**
Users should be able to see a ranking of the top 15 earners on the platforms
Show who earned the most sats weekly and then all time 

**Timeline:**
- Development Period: April 8, 2024, but only after completing parts 1-3
- Submission Deadline:  May 20, 2024
- Evaluation Period: Until May 31, 2024
- Winner Announcement: June 3, 2024

**Prizes:**
- 1st Place: 1,000,000 SATs
- Runner Up: 500,000 SATs

**Submission Guidelines:**
- Submissions to the same link as Part 3 (Submission link)
- When submitting the project, please ensure to provide a direct URL link to the live version hosted on a website (e.g., exampledemo.liveproject.com).
- Provide documentation on the used methodologies, libraries, and implemented security measures.
- Include both mobile and desktop views in the application and ensure responsiveness across both views.
- Upload the code and steps 1-4 to our GitHub repository: (https://github.com/The-MAS-Network/TheSolution/tree/SolutionCode).
- Ensure that the implemented functionalities are thoroughly documented while providing clear instructions for users to verify ownership of their ordinal wallet and for administrators to manage ordinal collections via the admin panel.

**Note:** Participating in this competition implies acknowledgment that winning codes will be shared as open source on The MAS Network's GitHub. This allows future developers to build upon them. Furthermore, the MAS Network has the right to reward projects on its own discretion. Contact sales@themasnetwork.com for clarifications or join our discord channel *https://discord.com/invite/UeNA5yXAug*.




