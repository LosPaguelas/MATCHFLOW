/**
 * MatchFlow Dashboard - Lógica principal
 */

if (!Guard.requireAuth('login.html')) {
  throw new Error('No autorizado');
}

let user = Guard.getCurrentUser();

function refreshProfileDisplay() {
  user = Guard.getCurrentUser();
  document.getElementById('profileAvatar').textContent = (user.name || user.email)[0].toUpperCase();
  document.getElementById('profileName').textContent = user.name || user.email;
  document.getElementById('profileTitle').textContent = user.type === 'candidate' ? (user.title || 'Candidato') : (user.industry || 'Empresa');
  document.getElementById('userName').textContent = user.name || user.email;
}

refreshProfileDisplay();

// Logout
document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  Guard.clearSession();
  window.location.href = 'index.html';
});

// Editar perfil
document.getElementById('editProfileBtn').addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  const candidateForm = document.getElementById('profileFormCandidate');
  const companyForm = document.getElementById('profileFormCompany');
  const isCandidate = user.type === 'candidate';

  candidateForm.style.display = isCandidate ? 'block' : 'none';
  companyForm.style.display = isCandidate ? 'none' : 'block';

  // Quitar required de la sección oculta para evitar validación incorrecta
  document.getElementById('profileNameInput').required = isCandidate;
  document.getElementById('profileCompanyNameInput').required = !isCandidate;

  if (isCandidate) {
    document.getElementById('profileNameInput').value = user.name || '';
    document.getElementById('profileTitleInput').value = user.title || '';
    document.getElementById('profileSkillsInput').value = (user.skills || []).join(', ');
    document.getElementById('profileExperienceInput').value = user.experience || '';
    document.getElementById('profileLocationInput').value = user.location || '';
    document.getElementById('profilePlanInput').value = user.plan || 'free';

  } else {
    document.getElementById('profileCompanyNameInput').value = user.name || '';
    document.getElementById('profileIndustryInput').value = user.industry || '';
    document.getElementById('profileCompanyLocationInput').value = user.location || '';
  }
  document.getElementById('profileModal').classList.add('active');
});

document.getElementById('closeProfileModal').addEventListener('click', () => {
  document.getElementById('profileModal').classList.remove('active');
});

document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const updated = { ...user };
  if (user.type === 'candidate') {
    updated.name = document.getElementById('profileNameInput').value.trim();
    updated.title = document.getElementById('profileTitleInput').value.trim();
    updated.skills = document.getElementById('profileSkillsInput').value.split(',').map((s) => s.trim()).filter(Boolean);
    updated.experience = document.getElementById('profileExperienceInput').value.trim();
    updated.location = document.getElementById('profileLocationInput').value.trim();
    updated.plan = document.getElementById('profilePlanInput').value;

    if (!updated.name) {
      alert('El nombre es obligatorio');
      return;
    }
  } else {
    updated.name = document.getElementById('profileCompanyNameInput').value.trim();
    updated.industry = document.getElementById('profileIndustryInput').value.trim();
    updated.location = document.getElementById('profileCompanyLocationInput').value.trim();
    if (!updated.name) {
      alert('El nombre de la empresa es obligatorio');
      return;
    }
  }
  try {
    await api.put('users', user.id, updated);
    if (user.type === 'company' && updated.name !== user.name) {
      const jobs = await api.get('jobs');
      for (const j of jobs.filter((j) => j.companyId === user.id)) {
        await api.patch('jobs', j.id, { companyName: updated.name });
      }
    }
    Guard.setSession(updated);
    refreshProfileDisplay();
    document.getElementById('profileModal').classList.remove('active');
    if (Guard.isCompany()) loadMyJobs();
  } catch (err) {
    alert('Error al guardar perfil');
  }
});

if (Guard.isCandidate()) {
  initCandidateView();
} else if (Guard.isCompany()) {
  initCompanyView();
}

window.changePlan = async function(plan) {
  try {

    const updatedUser = {
      ...user,
      plan
    };

    await api.put('users', user.id, updatedUser);

    // Actualizar sesión
    Guard.setSession(updatedUser);
    user = updatedUser;

    alert(`Ahora tienes plan ${plan.toUpperCase()}`);

    refreshProfileDisplay();

  } catch (err) {
    console.error(err);
    alert("Error al cambiar plan");
  }
};

document.getElementById('userPlan').textContent =
  user.plan || 'free';


// ========== VISTA CANDIDATO ==========
function initCandidateView() {
  document.getElementById('candidateView').style.display = 'block';
  document.getElementById('candidateApplicationsCard').style.display = 'block';
  document.getElementById('candidateMatchesCard').style.display = 'block';
  document.getElementById('candidateReservations').style.display = 'block';

  loadJobs();
  loadCandidateApplications();
  loadCandidateMatches();
  // loadCandidateReservations();
}

async function loadJobs() {
  try {
    const jobs = await api.get('jobs');
    const container = document.getElementById('jobsList');

    if (jobs.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💼</div><p>No hay ofertas publicadas aún</p></div>';
      return;
    }

    container.innerHTML = jobs.map((job) => `
      <div class="card job-card" data-job-id="${job.id}">
        <p class="job-company">${escapeHtml(job.companyName)}</p>
        <h3 class="job-title">${escapeHtml(job.title)}</h3>
        <div class="job-meta">
          <span>📍 ${escapeHtml(job.location)}</span>
          <span>⏱ ${escapeHtml(job.type)}</span>
          <span>💰 ${escapeHtml(job.salary)}</span>
        </div>
        <div class="job-skills">
          ${(job.skills || []).map((s) => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}
        </div>
      </div>
    `).join('');

container.querySelectorAll('.job-card').forEach((card) => {
  card.addEventListener('click', () => {
    // Obtenemos el ID del atributo data-job-id
    const jobIdFromCard = card.dataset.jobId;
    
    // IMPORTANTE: Usamos '==' (dos iguales) para que ignore si uno es
    // string "1" y el otro es número 1. 
    const selectedJob = jobs.find((j) => j.id == jobIdFromCard);
    
    if (selectedJob) {
      showJobDetail(selectedJob);
    } else {
      console.error("No se encontró el trabajo. ID en tarjeta:", jobIdFromCard);
      console.log("IDs disponibles en el array 'jobs':", jobs.map(j => j.id));
    }
  });
});
  } catch (err) {
    console.error(err);
    document.getElementById('jobsList').innerHTML = '<div class="alert alert-error">Error al cargar ofertas. ¿Servidor activo?</div>';
  }
}


let currentJobDetail = null;

async function showJobDetail(job) {
  if (!job) {
    console.error("Se intentó abrir el detalle pero el objeto 'job' es null o undefined");
    return; // Sale de la función y evita el error de 'title'
  }

  currentJobDetail = job;
  document.getElementById('jobDetailTitle').textContent = job.title;
  document.getElementById('jobDetailCompany').textContent = job.companyName;
  document.getElementById('jobDetailLocation').textContent = `${job.location} • ${job.type}`;
  document.getElementById('jobDetailDescription').textContent = job.description;
  document.getElementById('jobDetailSalary').textContent = job.salary || 'Salario no especificado';
  document.getElementById('jobDetailSkills').innerHTML = (job.skills || []).map((s) => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('');

  const applySection = document.getElementById('jobDetailApplySection');
  if (Guard.isCandidate()) {
    try {
      const applications = await api.get('applications');
      const myApp = applications.find((a) => a.jobId === job.id && a.candidateId === user.id);
      if (myApp) {
        const statusLabels = { pending: 'Pendiente', accepted: '✓ Aceptada', declined: 'Declinada' };
        applySection.innerHTML = `<span class="badge ${myApp.status === 'accepted' ? 'badge-match' : myApp.status === 'declined' ? 'alert-error' : ''}">${statusLabels[myApp.status] || myApp.status}</span>`;
      } else {
        applySection.innerHTML = `<button class="btn btn-primary" id="applyToJobBtn">Aplicar a esta oferta</button>`;
        document.getElementById('applyToJobBtn').addEventListener('click', () => applyToJob(job.id));
      }
    } catch (err) {
      applySection.innerHTML = '';
    }
  } else {
    applySection.innerHTML = '';
  }

  document.getElementById('jobDetailModal').classList.add('active');
} 

async function applyToJob(jobId) {
  try {
    const existing = await api.get('applications');
    if (existing.some((a) => a.jobId === jobId && a.candidateId === user.id)) return;
    await api.post('applications', {
      jobId,
      candidateId: user.id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    loadCandidateApplications();
    if (currentJobDetail && currentJobDetail.id === jobId) {
      document.getElementById('jobDetailApplySection').innerHTML = '<span class="badge">Pendiente</span>';
    }
  } catch (err) {
    alert('Error al aplicar');
  }
}

document.getElementById('closeJobDetail').addEventListener('click', () => {
  document.getElementById('jobDetailModal').classList.remove('active');
});

async function loadCandidateApplications() {
  try {
    const applications = await api.get('applications');
    const jobs = await api.get('jobs');
    const users = await api.get('users');
    const myApps = applications.filter((a) => a.candidateId === user.id);
    const container = document.getElementById('candidateApplicationsList');

    if (myApps.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No has aplicado a ninguna oferta</p></div>';
      return;
    }

    const statusLabels = { pending: 'Pendiente', accepted: 'Aceptada', declined: 'Declinada' };
    container.innerHTML = myApps.map((a) => {
      const job = jobs.find((j) => j.id === a.jobId);
      const company = users.find((u) => u.id === job?.companyId);
      if (!job) return '';
      const badgeClass = a.status === 'accepted' ? 'badge-match' : a.status === 'declined' ? 'badge-declined' : 'badge-pending';
      return `
        <div class="user-card">
          <div class="user-info" style="flex: 1;">
            <h4>${escapeHtml(job.title)}</h4>
            <p class="subtitle">${escapeHtml(job.companyName || company?.name)}</p>
            <span class="badge ${badgeClass}">${statusLabels[a.status] || a.status}</span>
          </div>
        </div>
      `;
    }).filter(Boolean).join('');
  } catch (err) {
    console.error(err);
  }
}

async function loadCandidateMatches() {
  try {
    const matches = await api.get('matches');
    const myMatches = matches.filter((m) => m.candidateId === user.id);
    const users = await api.get('users');
    const container = document.getElementById('candidateMatchesList');

    if (myMatches.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>Ninguna empresa te ha hecho match aún</p></div>';
      return;
    }

    container.innerHTML = myMatches.map((m) => {

  // Primero intenta usar el nombre guardado en el match
  let companyName = m.companyName;

  // Si no existe, lo busca en users (compatibilidad)
  if (!companyName) {
    const company = users.find((u) => String(u.id) === String(m.companyId));
    companyName = company?.name;
  }

  return companyName ? `
    <div class="user-card">
      <div class="user-avatar">${companyName[0].toUpperCase()}</div>
      <div class="user-info">
        <h4>${escapeHtml(companyName)}</h4>
        <span class="badge badge-match">Match</span>
      </div>
    </div>
  ` : '';

}).filter(Boolean).join('');

  } catch (err) {
    console.error(err);
    document.getElementById('candidateMatchesList').innerHTML = '<p>Error al cargar matches</p>';
  }
}

async function loadCandidateReservations() {
  try {
    const reservations = await api.get('reservations');
    const myReservations = reservations.filter((r) => r.candidateId === user.id);
    const users = await api.get('users');
    const container = document.getElementById('candidateReservationsList');

    if (myReservations.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>Ninguna empresa te ha reservado aún</p></div>';
      return;
    }

    container.innerHTML = myReservations.map((r) => {
      const company = users.find((u) => u.id === r.companyId);
      const job = r.jobId ? ' - Vacante asociada' : '';
      return company ? `
        <div class="user-card">
          <div class="user-avatar">${(company.name || 'E')[0]}</div>
          <div class="user-info">
            <h4>${escapeHtml(company.name)}</h4>
            <span class="badge badge-reserved">Reservado</span>
          </div>
        </div>
      ` : '';
    }).filter(Boolean).join('');
  } catch (err) {
    console.error(err);
  }
}

// ========== VISTA EMPRESA ==========
function initCompanyView() {
  document.getElementById('companyView').style.display = 'block';
  document.getElementById('companyStatsCard').style.display = 'block';
  document.getElementById('companyMatchesCard').style.display = 'block';
  document.getElementById('companyReservationsCard').style.display = 'block';

  loadMyJobs();
  loadApplicationsToMyJobs();
  loadCandidates();
  loadCompanyMatches();
  // loadCompanyReservations();

  // Modal nueva oferta
  document.getElementById('newJobBtn').addEventListener('click', () => {
    document.getElementById('jobForm').reset();
    document.getElementById('jobModal').classList.add('active');
  });

  document.getElementById('closeJobModal').addEventListener('click', () => {
    document.getElementById('jobModal').classList.remove('active');
  });

  document.getElementById('jobForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const job = {
      companyId: user.id,
      companyName: user.name,
      title: document.getElementById('jobTitle').value.trim(),
      description: document.getElementById('jobDescription').value.trim(),
      location: document.getElementById('jobLocation').value.trim() || 'No especificada',
      type: document.getElementById('jobType').value.trim() || 'Tiempo completo',
      salary: document.getElementById('jobSalary').value.trim() || 'A convenir',
      skills: document.getElementById('jobSkills').value.split(',').map((s) => s.trim()).filter(Boolean),
      postedAt: new Date().toISOString(),
    };
    try {
      await api.post('jobs', job);
      document.getElementById('jobModal').classList.remove('active');
      loadMyJobs();
    } catch (err) {
      alert('Error al publicar oferta');
    }
  });
}

async function loadMyJobs() {
  try {
    const jobs = await api.get('jobs');
    const myJobs = jobs.filter((j) => j.companyId === user.id);
    document.getElementById('jobCount').textContent = `${myJobs.length} oferta(s) publicada(s)`;

    const container = document.getElementById('myJobsList');
    if (myJobs.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No has publicado ofertas aún. ¡Crea la primera!</p></div>';
      return;
    }

    container.innerHTML = myJobs.map((job) => `
      <div class="card job-card" style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h3 class="job-title">${escapeHtml(job.title)}</h3>
          <div class="job-meta">${escapeHtml(job.location)} • ${escapeHtml(job.type)}</div>
        </div>
        <button class="btn btn-secondary" onclick="deleteJob('${job.id}')" style="width: auto;">Eliminar</button>
      </div>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}

async function loadApplicationsToMyJobs() {
  try {
    const applications = await api.get('applications');
    const jobs = await api.get('jobs');
    const users = await api.get('users');
    const myJobIds = jobs.filter((j) => j.companyId === user.id).map((j) => j.id);
    const myApps = applications.filter((a) => myJobIds.includes(a.jobId));
    const container = document.getElementById('applicationsToMyJobsList');

    if (myApps.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No hay solicitudes a tus ofertas</p></div>';
      return;
    }

    const statusLabels = { pending: 'Pendiente', accepted: 'Aceptada', declined: 'Declinada' };
    container.innerHTML = myApps.map((a) => {
      const job = jobs.find((j) => j.id === a.jobId);
      const candidate = users.find((u) => u.id === a.candidateId);
      if (!job || !candidate) return '';
      const isPending = a.status === 'pending';
      return `
        <div class="user-card">
          <div class="user-avatar">${(candidate.name || candidate.email)[0].toUpperCase()}</div>
          <div class="user-info" style="flex: 1;">
            <h4>${escapeHtml(candidate.name || candidate.email)}</h4>
            <p class="subtitle">${escapeHtml(job.title)} • ${escapeHtml(candidate.title || '')}</p>
            
            ${isPending ? `
              
            ` : ''}
          </div>
        </div>
      `;
    }).filter(Boolean).join('');
  } catch (err) {
    console.error(err);
    document.getElementById('applicationsToMyJobsList').innerHTML = '<p>Error al cargar solicitudes</p>';
  }
}

window.respondApplication = async function (applicationId, status) {
  try {
    await api.patch('applications', applicationId, { status });
    loadApplicationsToMyJobs();
    if (Guard.isCandidate()) loadCandidateApplications();
  } catch (err) {
    alert('Error al actualizar');
  }
};
// ----------------------------------------------------------
window.deleteJob = async function (id) {
  if (!confirm('¿Eliminar esta oferta?')) return;
  try {
    await api.delete('jobs', id);
    loadMyJobs();
  } catch (err) {
    alert('Error al eliminar');
  }
};

async function loadCandidates() {
  try {
    const users = await api.get('users');
    const candidates = users.filter((u) => u.type === 'candidate');
    const container = document.getElementById('candidatesList');

    if (candidates.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No hay candidatos registrados</p></div>';
      return;
    }

    const matches = await api.get('matches');
    const reservations = await api.get('reservations');

    container.innerHTML = candidates.map((c) => {
      const isMatch = matches.some((m) => m.companyId === user.id && m.candidateId === c.id);
      return `
        <div class="user-card2">
          <div class="user-avatar">${(c.name || c.email)[0].toUpperCase()}</div>
          <div class="user-info" style="flex: 1;">
            <h4>${escapeHtml(c.name || c.email)}</h4>
            <p class="subtitle">${escapeHtml(c.title || 'Candidato')} • ${escapeHtml(c.experience || '')}</p>
            <div class="job-skills" style="margin-top: 8px;">
              ${(c.skills || []).slice(0, 5).map((s) => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}
            </div>
            <div class="user-actions">
              ${!isMatch ? `<button class="btn btn-primary" style="width: auto; padding: 8px 16px;" onclick="matchCandidate('${c.id}')">✨ Hacer match</button>` : '<span class="badge badge-match">Match realizado</span>'}
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error(err);
    document.getElementById('candidatesList').innerHTML = '<div class="alert alert-error">Error al cargar candidatos</div>';
  }
}

window.matchCandidate = async function (candidateId) {
  try {

    const matches = await api.get('matches');
    const users = await api.get('users');

    const candidate = users.find(u => String(u.id) === String(candidateId));

    // Plan por defecto free
    const plan = candidate?.plan || 'free';

    const planLimits = {
      free: 1,
      plata: 3,
      gold: 6
    };

    const candidateMatches = matches.filter(
      m => String(m.candidateId) === String(candidateId)
    );

    // Validar límite
    if (candidateMatches.length >= planLimits[plan]) {
      alert(`Este candidato tiene plan ${plan} y ya alcanzó su límite de matches.`);
      return;
    }

    // Validar match existente empresa-candidato
    const alreadyMatch = matches.some(m =>
      String(m.companyId) === String(user.id) &&
      String(m.candidateId) === String(candidateId)
    );

    if (alreadyMatch) {
      alert("Ya hiciste match con este candidato");
      return;
    }

    // Crear match
    await api.post('matches', {
      companyId: String(user.id),
      companyName: user.name,
      candidateId: String(candidateId),
      createdAt: new Date().toISOString()
    });

    alert("Match realizado 🚀");

    loadCandidates();
    loadCompanyMatches();

  } catch (err) {
    console.error(err);
    alert('Error al hacer match');
  }
};





// window.reserveCandidate = async function (candidateId) {
//   try {
//     const existing = await api.get('reservations');
//     if (existing.some((r) => r.companyId === user.id && r.candidateId === candidateId)) return;
//     await api.post('reservations', { companyId: user.id, candidateId, createdAt: new Date().toISOString() });
//     loadCandidates();
//     loadCompanyReservations();
//   } catch (err) {
//     alert('Error al reservar');
//   }
// };

// async function loadCompanyMatches() {
//   try {
//     const matches = await api.get('matches');
//     const myMatches = matches.filter((m) => m.companyId === user.id);
//     const users = await api.get('users');
//     const container = document.getElementById('companyMatchesList');

//     if (myMatches.length === 0) {
//       container.innerHTML = '<div class="empty-state"><p>No has hecho match con nadie aún</p></div>';
//       return;
//     }

//     container.innerHTML = myMatches.map((m) => {
//       const cand = users.find((u) => u.id === m.candidateId);
//       return cand ? `
//         <div class="user-card">
//           <div class="user-avatar">${(cand.name || cand.email)[0].toUpperCase()}</div>
//           <div class="user-info">
//             <h4>${escapeHtml(cand.name || cand.email)}</h4>
//             <span class="badge badge-match">Match</span>
//           </div>
//         </div>
//       ` : '';
//     }).filter(Boolean).join('');
//   } catch (err) {
//     console.error(err);
//   }
// }

/* ================= MATCHES EMPRESA ================= */


async function loadCompanyMatches() {
try {
const matches = await api.get('matches');
const users = await api.get('users');


const myMatches = matches.filter((m) =>
String(m.companyId) === String(user.id)
);


const container = document.getElementById('companyMatchesList');


if (!myMatches.length) {
container.innerHTML = '<div class="empty-state"><p>No has hecho match con nadie aún</p></div>';
return;
}


container.innerHTML = myMatches.map((m) => {
const cand = users.find((u) => String(u.id) === String(m.candidateId));


return cand ? `
<div class="user-card">
<div class="user-avatar">${(cand.name || cand.email)[0].toUpperCase()}</div>
<div class="user-info">
<h4>${escapeHtml(cand.name || cand.email)}</h4>
<span class="badge badge-match">Match</span>
</div>
</div>
` : '';


}).join('');


} catch (err) {
console.error(err);
}
}

// async function loadCompanyReservations() {
//   try {
//     const reservations = await api.get('reservations');
//     const myReservations = reservations.filter((r) => r.companyId === user.id);
//     const users = await api.get('users');
//     const container = document.getElementById('companyReservationsList');

//     if (myReservations.length === 0) {
//       container.innerHTML = '<div class="empty-state"><p>No has reservado candidatos</p></div>';
//       return;
//     }

//     container.innerHTML = myReservations.map((r) => {
//       const cand = users.find((u) => u.id === r.candidateId);
//       return cand ? `
//         <div class="user-card">
//           <div class="user-avatar">${(cand.name || cand.email)[0].toUpperCase()}</div>
//           <div class="user-info">
//             <h4>${escapeHtml(cand.name || cand.email)}</h4>
//             <span class="badge badge-reserved">Reservado</span>
//           </div>
//         </div>
//       ` : '';
//     }).filter(Boolean).join('');
//   } catch (err) {
//     console.error(err);
//   }
// }

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Cerrar modales al hacer clic fuera
document.getElementById('jobModal').addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('active');
});
document.getElementById('jobDetailModal').addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('active');
});
document.getElementById('profileModal').addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('active');
});
