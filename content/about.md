+++
title = "about me"
author = "Trying to define yourself is like trying to bite your own teeth. — Alan Watts, British-American writer and philosopher"
+++

<style>
.terminal-hover {
  position: relative;
  color: #d07fd6;
  text-decoration: none;
}

.terminal-hover::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background-color: #d07fd6;
  transition: width 0.3s ease;
}

.terminal-hover:hover::after {
  width: 100%;
}

.terminal-popup {
  visibility: hidden;
  opacity: 0;
  width: 350px;
  background: black;
  color: #d07fd6;
  border: 1px solid #d07fd6;
  border-radius: 6px;
  padding: 10px;
  position: absolute;
  z-index: 100;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.3s;
  font-size: 16px;
  line-height: 1.4;
  box-shadow: 0 0 10px #d07fd6;
}

.terminal-hover:hover .terminal-popup {
  visibility: visible;
  opacity: 1;
}

/* Responsive layout for mobile */
.flex-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .flex-section {
    flex-direction: column;
    text-align: center;
  }
}
</style>

<div class="flex-section">
  <div style="flex: 3; text-align: center;">
    <img src="/georgiatech.jpg" alt="georgia tech" style="max-width: 100%; height: auto;" />
  </div>

  <div style="flex: 4;">
    <h2>me</h2>
    <p>
      Hi! I’m <span class="terminal-hover">
  Karthik Singaravadivelan<span class="terminal-popup">
        me!<br><br>
        <img src="/karthik.JPG" alt="london" style="margin: auto; max-width: 90%; height: auto;" />
    </span></span>, a Computer Science + Psychology Major and Stamps President’s Scholar at Georgia Institute of Technology studying the intersection of <span class="terminal-hover">
  cognitive science<span class="terminal-popup">
        <strong>Cognitive Science:</strong><br>
        The study of thought, learning, and mental organization, which draws on aspects of psychology, linguistics, philosophy, and computer modeling.
    </span></span>&nbsp;with modern applications of <span class="terminal-hover">
  artificial intelligence<span class="terminal-popup">
        <strong>Artificial Intelligence:</strong><br>
        The theory and development of computer systems able to perform tasks that normally require human intelligence, such as visual perception, speech recognition, decision-making, and translation between languages.
    </span></span>. Specifically, I’m interested in how we can recreate human-like performance by iterating on principles of human-like learning.
    </p>
  </div>
</div>

<div class="flex-section">
  <div style="flex: 4;">
    <h2>now</h2>
    <p>
      I'm actively involved in <a href="/projects">lab efforts</a> that pursue a variety of research 
      <a href="/interests">thrusts</a>, but my immediate goals can all be linked towards developing new 
      strategies of cognition, iterating on knowledge representations, and leveraging properties of the brain and mind in humans to cultivate robust learning.
    </p>
  </div>

  <div style="flex: 3; text-align: center;">
    <img src="/glacier.JPG" alt="glacier" style="max-width: 100%; height: auto;" />
  </div>
</div>

<div class="flex-section">
  <div style="flex: 2; text-align: center;">
    <img src="/matterhorn.JPG" alt="matterhorn" style="max-width: 100%; height: auto;" />
  </div>

  <div style="flex: 3;">
    <h2>tomorrow</h2>
    <p>
      In my future, I hope to pursue a Computer Science PhD arguing the importance of fundamental tenets of human-like learning and intelligence in the global AI movement by developing
      <span class="terminal-hover">neuro-symbolic<span class="terminal-popup">
        <strong>Neuro-symbolic:</strong><br>
        A type of architecture that integrates neural and symbolic AI architectures to address the weaknesses of each, providing a robust AI capable of cognitive modeling.
    </span></span> 
    artificial <span class="terminal-hover">intelligence<span class="terminal-popup">
        <strong>Intelligence:</strong><br>
        Intelligence is the ability to handle new situations with little or no prior training, and, in my opinion, should be measured by the speed of learning and not the end of performance (we assume perfection by "good enough", as humans learn).
    </span></span>, hoping to take advantage of these fundamental tenets to further the path to AGI. In a broader sense, I am excited to see the discovery of
      <span class="terminal-hover">superintelligence<span class="terminal-popup">
        <strong>Superintelligence:</strong><br>
        If intelligence is the ability to handle new situations with little or no prior training, then progress towards greater intelligence achieves new frontiers on the tradeoff between data and performance on new tasks. With respect to this tradeoff, <strong>superintelligence</strong> is the feat of ultimate generalization with little or no data in the space.
    </span></span>, the restructuring of modern capitalism for the prioritization of scientific discovery, and innovations in the education system that prime future generations to find their why.
    </p>
  </div>
</div>

<p><em>pictures taken in georgia tech, alaska, switzerland</em></p>

[linkedin](https://www.linkedin.com/in/karthik-singaravadivelan/) | [github](https://github.com/karthiksing05) | [instagram](https://www.instagram.com/karthik.sing.05/) | [email: karthiksing05@gmail.com](mailto:karthiksing05@gmail.com)