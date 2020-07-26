<script>
  import { onMount } from 'svelte'

  export let loading = false
  export let records = []

  async function fetchRecords() {
    if (loading) {
      return
    } else {
      loading = true
    }

    const offset = records.length
    const res = await fetch('/api/display' + (offset ? `?offset=${offset}` : ''));
    records = [...records, ...await res.json()]
    loading = false
  }

  onMount(async () => {
    await fetchRecords({ offset: records.length })
  });
</script>

<main>
  <h1>Webpack benchmark!</h1>
  <table>
    <thead>
      <th>User</th>
      <th>Platform</th>
      <th>CPU</th>
      <th>Memory</th>
      <th>Working Directory</th>
      <th>Bundle size (KB)</th>
      <th>Time cost (ms)</th>
    </thead>
    <tbody>
      {#each records as record}
      <tr>
        <td>{record.userInfo.username}</td>
        <td>{record.platformInfo.platform}</td>
        <td>{record.platformInfo.cpu}</td>
        <td>{record.platformInfo.memory}</td>
        <td>{record.platformInfo.workingDir}</td>
        <td>{record.buildInfo.bundleSize}</td>
        <td>{record.buildInfo.buildTime}</td>
      </tr>
    {/each}
    </tbody>
  </table>
</main>
